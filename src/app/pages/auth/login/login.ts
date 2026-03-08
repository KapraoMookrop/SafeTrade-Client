import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAppService } from '../../../API/UserAppService';
import Swal from 'sweetalert2';
import { LoadingService } from '../../../core/LoadingService';
import { UserLoginRequest } from '../../../types/UserLoginRequest';
import { UserSignUpDataRequest } from '../../../types/UserSignUpDataRequest';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreAppService } from '../../../API/CoreAppService';
import { ProvinceData } from '../../../types/ProvinceData';
import { DistrictData } from '../../../types/DistrictData';
import { SubDistrictData } from '../../../types/SubDistrictData';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, NgSelectModule],
  providers: [],
  templateUrl: './login.html',
})
export class Login {
  UserLoginRequest: UserLoginRequest = {} as UserLoginRequest;
  UserSignUpRequest: UserSignUpDataRequest = {} as UserSignUpDataRequest;
  ConfirmPassword?: string;

  constructor(public loadingService: LoadingService,
    private UserAppService: UserAppService,
    private CoreAppService: CoreAppService,
    private router: Router) {
  }

  ngOnInit() {
    this.FindProvince();
  }

  isLogin = true;
  toggle() {
    this.isLogin = !this.isLogin;
  }

  async Login() {
    this.loadingService.show();
    try {
      const result = await this.UserAppService.Login(this.UserLoginRequest);

      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        text: 'ยินดีต้อนรับเข้าสู่ระบบ',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.setLocalStrorage('token', result);
        this.router.navigate(['/home']);
      });

    } catch (err: HttpErrorResponse | any) {
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        text: err.error?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      });

      console.error('Login failed:', err);
    } finally {
      this.loadingService.hide();
    }
  }

  step = 1;
  nextStep() {
    switch (this.step) {
      case 1:
        if (!this.isValidEmail(this.UserSignUpRequest.Email)) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            html: `<div class="text-lg font-medium">
                    รูปแบบอีเมลไม่ถูกต้อง
                  </div>`,
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
            html: `<div class="text-lg font-medium">
                    กรุณากรอกข้อมูลให้ครบถ้วนก่อน
                  </div>`,
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
            html: `<div class="text-lg font-medium">
                    รหัสผ่านไม่ตรงกัน
                  </div>`,
            showConfirmButton: false,
            timer: 2000,
          })
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
            html: `<div class="text-lg font-medium">
                    กรุณากรอกข้อมูลให้ครบถ้วนก่อน
                  </div>`,
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
            html: `<div class="text-lg font-medium">
                    รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง
                  </div>`,
            showConfirmButton: false,
            timer: 2000,
          })
          return;
        }

        this.step++;
        break;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  async Signup() {
    this.loadingService.show();
    try {
      // await this.UserAppService.Signup(this.UserSignUpRequest);

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
    } catch (err) {
      Swal.fire('Error', 'เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ', 'error');
    }
  }

  async FindDistrict(provinceId: string) {
    try {
      const result = await this.CoreAppService.GetDistricts(provinceId);
      this.DistrictDatas = result;
    } catch (err) {
      Swal.fire('Error', 'เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ', 'error');
    }
  }

  async FindSubDistrict(districtId: string) {
    try {
      const result = await this.CoreAppService.GetSubDistricts(districtId);
      this.SubDistrictDatas = result;
    } catch (err) {
      Swal.fire('Error', 'เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ', 'error');
    }
  }

  private setLocalStrorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  }
}