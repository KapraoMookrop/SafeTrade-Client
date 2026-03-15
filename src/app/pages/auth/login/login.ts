import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAppService } from '../../../API/UserAppService';
import Swal from 'sweetalert2';
import { LoadingService } from '../../../core/LoadingService';
import { AuthService } from '../../../core/AuthService';
import { UserSignUpDataRequest } from '../../../types/UserSignUpDataRequest';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreAppService } from '../../../API/CoreAppService';
import { ProvinceData } from '../../../types/ProvinceData';
import { DistrictData } from '../../../types/DistrictData';
import { SubDistrictData } from '../../../types/SubDistrictData';
import { UserClientData } from '../../../types/UserClientData';
import { Verify2FAType } from '../../../types/Enum';
import { LoginResponseData } from '../../../types/LoginResponseData';
import { UserLoginDataRequest } from '../../../types/UserLoginDataRequest';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, NgSelectModule],
  providers: [],
  templateUrl: './login.html',
})
export class Login implements OnInit {
  UserLoginRequest: UserLoginDataRequest = {} as UserLoginDataRequest;
  UserSignUpRequest: UserSignUpDataRequest = {} as UserSignUpDataRequest;
  ConfirmPassword?: string;
  IsShowPassword: boolean = false;
  IsShowConfirmPassword: boolean = false;

  constructor(public loadingService: LoadingService,
    private readonly AuthService: AuthService,
    private readonly UserAppService: UserAppService,
    private readonly CoreAppService: CoreAppService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.FindProvince();
  }

  isLogin = true;
  toggle() {
    this.isLogin = !this.isLogin;
  }

  async Login() {
    try {
      if (this.UserLoginRequest.Email == null || this.UserLoginRequest.Password == null) {
        return;
      }
      this.loadingService.show();
      let clientLogin = await this.UserAppService.Login(this.UserLoginRequest);
      this.loadingService.hide();

      if (clientLogin.IsEnabled2FA) {

        const result = await Swal.fire({
          title: 'ยืนยันตัวตน',
          html: `<div style="text-align:center">
                    <p style="margin-bottom:10px">กรอกรหัส 6 หลักจากแอป Authenticator</p>

                    <div id="otp-container" style="display:flex; gap:10px; justify-content:center;">
                      <input class="otp-input" maxlength="1" />
                      <input class="otp-input" maxlength="1" />
                      <input class="otp-input" maxlength="1" />
                      <input class="otp-input" maxlength="1" />
                      <input class="otp-input" maxlength="1" />
                      <input class="otp-input" maxlength="1" />
                    </div>
                  </div>`,
          showCancelButton: true,
          confirmButtonText: 'ยืนยัน',
          cancelButtonText: 'ยกเลิก',
          focusConfirm: false,

          didOpen: () => {
            const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');

            inputs.forEach((input, index) => {
              input.style.width = '45px';
              input.style.height = '55px';
              input.style.fontSize = '24px';
              input.style.textAlign = 'center';
              input.style.border = '1px solid #ddd';
              input.style.borderRadius = '8px';

              input.addEventListener('input', () => {
                if (input.value.length === 1 && index < inputs.length - 1) {
                  inputs[index + 1].focus();
                }
              });

              input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                  inputs[index - 1].focus();
                }
              });
            });

            inputs[0].focus();
          },

          preConfirm: () => {
            const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');
            let code = '';

            inputs.forEach(i => code += i.value);

            if (code.length !== 6) {
              Swal.showValidationMessage('กรุณากรอกรหัส 6 หลัก');
              return false;
            }

            return code;
          }
        });

        if (!result.isConfirmed) {
          this.loadingService.hide();
          return;
        }

        this.loadingService.show();
        clientLogin = await this.CoreAppService.Verify2FA(this.UserLoginRequest.Email, result.value, Verify2FAType.VERIFYLOGIN);
        this.loadingService.hide();
      }

      await this.AfterLogin(clientLogin);

    } catch (err: HttpErrorResponse | any) {

      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        text: err.error?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      });

    } finally {
      this.loadingService.hide();
    }
  }

  step = 1;
  async nextStep() {
    switch (this.step) {
      case 1:
        if (!this.isValidEmail(this.UserSignUpRequest.Email)) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            text: `รูปแบบอีเมลไม่ถูกต้อง`,
            showConfirmButton: false,
            timer: 2000,
          })
          return;
        }

        if (!this.UserSignUpRequest.Email || !this.UserSignUpRequest.Password || !this.ConfirmPassword) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            text: `กรุณากรอกข้อมูลให้ครบถ้วนก่อน`,
            showConfirmButton: false,
            timer: 2000,
          })
          return;
        }

        if (this.UserSignUpRequest.Password !== this.ConfirmPassword) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            text: `รหัสผ่านไม่ตรงกัน`,
            showConfirmButton: false,
            timer: 2000,
          })
          return;
        }

        const passwordValidationResult = await this.validatePassword(this.UserSignUpRequest.Password);
        if (!passwordValidationResult.isValid) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            text: passwordValidationResult.details,
            showConfirmButton: false,
            timer: 3000,
          })
          return;
        }

        if (await this.checkAlreadyExistsEmail()) {
          return;
        }

        this.step++;
        break;
      case 2:
        if (!this.UserSignUpRequest.FullName || !this.UserSignUpRequest.AddressInfo || !this.UserSignUpRequest.Phone
          || !this.UserSignUpRequest.ProvinceId || !this.UserSignUpRequest.DistrictId || !this.UserSignUpRequest.SubDistrictId) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            text: `กรุณากรอกข้อมูลให้ครบถ้วนก่อน`,
            showConfirmButton: false,
            timer: 2000,
          })
          return;
        }

        if (!this.isValidPhone(this.UserSignUpRequest.Phone)) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            text: `รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง`,
            showConfirmButton: false,
            timer: 2000,
          })
          return;
        }

        this.step++;
        break;
    }

    this.cdr.detectChanges();
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  async Signup() {
    this.loadingService.show();
    try {
      await this.UserAppService.Signup(this.UserSignUpRequest);

      Swal.fire({
        icon: 'success',
        title: 'สมัครสมาชิกสำเร็จ',
        text: 'กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ',
      });

      this.isLogin = true;

    } catch (err: HttpErrorResponse | any) {
      Swal.fire({
        icon: 'error',
        title: 'สมัครสมาชิกไม่สำเร็จ',
        text: err.error?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
      });

      console.error('Signup failed:', err);
    } finally {
      this.loadingService.hide();
    }
  }

  ProvinceDatas: ProvinceData[] = [];
  DistrictDatas: DistrictData[] = [];
  SubDistrictDatas: SubDistrictData[] = [];

  private SelectedProvince: ProvinceData | null = null;
  get selectedProvince() {
    return this.SelectedProvince;
  }
  set selectedProvince(province: ProvinceData | null) {
    this.SelectedProvince = province;
    this.UserSignUpRequest.ProvinceId = province?.Id || '';
    this.UserSignUpRequest.DistrictId = '';
    this.UserSignUpRequest.SubDistrictId = '';
    this.UserSignUpRequest.ZipCode = '';

    this.SelectedDistrict = null;
    this.DistrictDatas = [];

    this.SelectedSubDistrict = null;
    this.SubDistrictDatas = [];

    if (province) {
      this.FindDistrict(province.Id);
    }

  }

  private SelectedDistrict: DistrictData | null = null;
  get selectedDistrict() {
    return this.SelectedDistrict;
  }
  set selectedDistrict(district: DistrictData | null) {
    this.SelectedDistrict = district;
    this.UserSignUpRequest.DistrictId = district?.Id || '';
    this.UserSignUpRequest.SubDistrictId = '';
    this.UserSignUpRequest.ZipCode = '';

    this.SelectedSubDistrict = null;
    this.SubDistrictDatas = [];

    if (district) {
      this.FindSubDistrict(district.Id);
    }
  }

  private SelectedSubDistrict: SubDistrictData | null = null;
  get selectedSubDistrict() {
    return this.SelectedSubDistrict;
  }
  set selectedSubDistrict(subDistrict: SubDistrictData | null) {
    this.SelectedSubDistrict = subDistrict;

    this.UserSignUpRequest.SubDistrictId = subDistrict?.Id || '';
    this.UserSignUpRequest.ZipCode = subDistrict?.ZipCode || '';
  }

  async FindProvince() {
    try {
      const result = await this.CoreAppService.GetProvinces();
      this.ProvinceDatas = result;
    } catch (err: HttpErrorResponse | any) {
      Swal.fire(`Error', 'เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ + ${err.message} ', 'error`);
    }
  }

  async FindDistrict(provinceId: string) {
    this.loadingService.show();
    try {
      const result = await this.CoreAppService.GetDistricts(provinceId);
      this.DistrictDatas = result;
    } catch (err: HttpErrorResponse | any) {
      Swal.fire(`Error', 'เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ + ${err.message} ', 'error`);
    } finally {
      this.loadingService.hide();
    }
  }

  async FindSubDistrict(districtId: string) {
    this.loadingService.show();
    try {
      const result = await this.CoreAppService.GetSubDistricts(districtId);
      this.SubDistrictDatas = result;
    } catch (err: HttpErrorResponse | any) {
      Swal.fire(`Error', 'เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ + ${err.message} ', 'error`);
    } finally {
      this.loadingService.hide();
    }
  }

  async ForgotPassword() {
    const { value: email } = await Swal.fire({
      title: 'ลืมรหัสผ่าน',
      input: 'email',
      inputLabel: 'กรุณากรอกอีเมลที่คุณใช้สมัครสมาชิก',
      inputPlaceholder: 'อีเมล',
      showCancelButton: true,
      confirmButtonText: 'ส่งอีเมลรีเซ็ตรหัสผ่าน',
      cancelButtonText: 'ยกเลิก',
    });

    if (email) {
      try {
        this.loadingService.show();
        await this.CoreAppService.SendForgotPasswordEmail(email);
        Swal.fire({
          icon: 'success',
          title: 'ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว',
          text: 'กรุณาตรวจสอบอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน',
        });
      } catch (err: HttpErrorResponse | any) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: err.error?.message || 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน',
        });
      } finally {
        this.loadingService.hide();
      }
    }
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  }

  private async AfterLogin(clientData: LoginResponseData) {
    const ClientUser = {
      FullName: clientData.FullName,
      Email: clientData.Email,
      Phone: clientData.Phone,
      Role: clientData.Role,
      KycStatus: clientData.KycStatus,
      UserStatus: clientData.UserStatus,
      IsEnabled2FA: clientData.IsEnabled2FA
    } as UserClientData;

    Swal.fire({
      icon: 'success',
      title: 'เข้าสู่ระบบสำเร็จ',
      text: 'ยินดีต้อนรับเข้าสู่ระบบ',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      this.AuthService.SetUserClient(clientData.JWT, ClientUser, '');
      this.router.navigate(['/home']);
    });
  }

  private async checkAlreadyExistsEmail() {
    try {
      const result = await this.UserAppService.CheckAlreadyExistsEmail(this.UserSignUpRequest.Email);
      return result;
    } catch (err: HttpErrorResponse | any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.error?.message || 'เกิดข้อผิดพลาดในการตรวจสอบอีเมล',
      });
      return true;
    }
  }

  private async validatePassword(password: string): Promise<{ isValid: boolean; details: string; }> {
    if (password.length < 8) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยตัวพิมพ์ใหญ่ อย่างน้อย 1 ตัว"
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยตัวพิมพ์เล็ก อย่างน้อย 1 ตัว"
      };
    }

    if (!/\d/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยตัวเลข อย่างน้อย 1 ตัว"
      };
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยอักขระพิเศษ อย่างน้อย 1 ตัว"
      };
    }

    return {
      isValid: true,
      details: ""
    };
  }
}