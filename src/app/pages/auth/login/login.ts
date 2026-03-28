import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAppService } from '../../../API/UserAppService';
import { UserSignUpDataRequest } from '../../../types/UserSignUpDataRequest';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreAppService } from '../../../API/CoreAppService';
import { ProvinceData } from '../../../types/ProvinceData';
import { DistrictData } from '../../../types/DistrictData';
import { SubDistrictData } from '../../../types/SubDistrictData';
import { UserClientData } from '../../../types/UserClientData';
import { Verify2FAType } from '../../../types/Enum';
import { LoginResponseData } from '../../../types/LoginResponseData';
import { UserLoginDataRequest } from '../../../types/UserLoginDataRequest';
import { BaseComponent } from '../../../core/BaseComponent';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, NgSelectModule],
  providers: [],
  templateUrl: './login.html',
})
export class Login extends BaseComponent implements OnInit {
  UserLoginRequest: UserLoginDataRequest = {} as UserLoginDataRequest;
  UserSignUpRequest: UserSignUpDataRequest = {} as UserSignUpDataRequest;
  ConfirmPassword?: string;
  IsShowPassword: boolean = false;
  IsShowConfirmPassword: boolean = false;

  constructor(private readonly UserAppService: UserAppService,
    private readonly CoreAppService: CoreAppService) {
    super();
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
      let clientLogin = await this.UserAppService.Login(this.UserLoginRequest);

      if (clientLogin.IsEnabled2FA) {

        const result = await this.Swal2FAAlert();

        if (!result.isConfirmed) {
          return;
        }

        clientLogin = await this.CoreAppService.Verify2FA(this.UserLoginRequest.Email, result.value, Verify2FAType.VERIFYLOGIN);
      }

      await this.AfterLogin(clientLogin);

    } catch (err: HttpErrorResponse | any) {
      await this.SwalError('เข้าสู่ระบบไม่สำเร็จ', err.error?.message || err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  }

  step = 1;
  async nextStep() {
    switch (this.step) {
      case 1:
        if (!this.isValidEmail(this.UserSignUpRequest.Email)) {
          await this.Swaltoast('รูปแบบอีเมลไม่ถูกต้อง', 'error');
          return;
        }

        if (!this.UserSignUpRequest.Email || !this.UserSignUpRequest.Password || !this.ConfirmPassword) {
          await this.Swaltoast('กรุณากรอกข้อมูลให้ครบถ้วนก่อน', 'error');
          return;
        }

        if (this.UserSignUpRequest.Password !== this.ConfirmPassword) {
          await this.Swaltoast('รหัสผ่านไม่ตรงกัน', 'error');
          return;
        }

        const passwordValidationResult = await this.validatePassword(this.UserSignUpRequest.Password);
        if (!passwordValidationResult.isValid) {
          await this.Swaltoast(passwordValidationResult.details, 'error');
          return;
        }

        if (await this.checkAlreadyExistsEmail()) {
          await this.Swaltoast('อีเมลนี้ถูกใช้งานแล้ว', 'error');
          return;
        }

        this.step++;
        break;
      case 2:
        if (!this.UserSignUpRequest.FullName || !this.UserSignUpRequest.AddressInfo || !this.UserSignUpRequest.Phone
            || !this.UserSignUpRequest.ProvinceId || !this.UserSignUpRequest.DistrictId || !this.UserSignUpRequest.SubDistrictId) {
          await this.Swaltoast('กรุณากรอกข้อมูลให้ครบถ้วนก่อน', 'error');
          return;
        }

        if (!this.isValidPhone(this.UserSignUpRequest.Phone)) {
          await this.Swaltoast('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง', 'error');
          return;
        }

        this.step++;
        break;
    }

    this.RefreshDetectChanges();
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  async Signup() {
    try {
      await this.UserAppService.Signup(this.UserSignUpRequest);
      await this.SwalSuccess('สมัครสมาชิกสำเร็จ', 'กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ');
      this.NavigateTo('/login');
      this.isLogin = true;
    } catch (err: HttpErrorResponse | any) {
      await this.SwalError('สมัครสมาชิกไม่สำเร็จ', err.error?.message || err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
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
      await this.SwalError('เกิดข้อผิดพลาด', `เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ + ${err.error?.message || err.message}`);
    }
  }

  async FindDistrict(provinceId: string) {
    try {
      const result = await this.CoreAppService.GetDistricts(provinceId);
      this.DistrictDatas = result;
    } catch (err: HttpErrorResponse | any) {
      await this.SwalError('เกิดข้อผิดพลาด', `เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ + ${err.error?.message || err.message}`);
    }
  }

  async FindSubDistrict(districtId: string) {
    try {
      const result = await this.CoreAppService.GetSubDistricts(districtId);
      this.SubDistrictDatas = result;
    } catch (err: HttpErrorResponse | any) {
      await this.SwalError('เกิดข้อผิดพลาด', `เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ + ${err.error?.message || err.message}`);
    }
  }

  async ForgotPassword() {
    const { value: email } = await this.SwalInputAlert('ลืมรหัสผ่าน', 'email', 'รูปแบบอีเมลไม่ถูกต้อง', 'กรุณากรอกอีเมลที่คุณใช้สมัครสมาชิก', 'อีเมล', 'ส่งอีเมลรีเซ็ตรหัสผ่าน', 'ยกเลิก');
    if (email) {
      try {
        await this.CoreAppService.SendForgotPasswordEmail(email);
        await this.SwalSuccess('ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว', 'กรุณาตรวจสอบอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน');
      } catch (err: HttpErrorResponse | any) {
        await this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message || 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน');
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

    this.SwalAlert('เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับเข้าสู่ระบบ', 'success', 1500, false).then(() => {
      this.AuthService.SetUserClient(clientData.JWT, ClientUser, '');
      this.NavigateTo('/home');
    });
  }

  private async checkAlreadyExistsEmail() {
    try {
      const result = await this.UserAppService.CheckAlreadyExistsEmail(this.UserSignUpRequest.Email);
      return result;
    } catch (err: HttpErrorResponse | any) {
      await this.SwalError('เกิดข้อผิดพลาด', `เกิดข้อผิดพลาดในการตรวจสอบอีเมล กรุณาติดต่อผู้ดูแลระบบ + ${err.error?.message || err.message}`);
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