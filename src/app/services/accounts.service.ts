import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(public appservice: AppService, private _localStorage: LocalStorageService) { }


  onOrderDetailsGet(FromDate, ToDate): Observable<any> {
    let dTempAcId = this._localStorage.getItem('CusEShopId');
    var ServiceParams = {};
    ServiceParams['strProc'] = 'EShopOrderMainDatewise_AcId';

    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = 'AcId';
    ProcParams['strArgmt'] = dTempAcId.toString();
    oProcParams.push(ProcParams);

    var ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = FromDate;
    oProcParams.push(ProcParams);

    var ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = ToDate;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
     return this.appservice.post('CommonQuery/fnGetDataReportNew', body);
  }

  onCanceledOrder(orderid, uniqueid): Observable<any> {
    let errmsg = "'Sorry..! The Order Cannot be Cancel after 30 Minutes'";
    let msg = "'Your order hasbeen cancelled...!'";

    let strQuery = 'update EShopOrderMain set Order_Cancel = 1 where OrderMain_Id = ' + orderid + ' and UniqueId = ' + uniqueid +
      ' and OrderMain_Date BETWEEN  dateadd(dd,0, cast(getdate() as date)) and cast(getdate() as date) and'
      + ' OrderMain_Time between CONVERT(VARCHAR(8),DateADD(mi, -30, Current_TimeStamp),108) and CONVERT(VARCHAR(8),GETDATE(),108)'
      + ' IF @@ROWCOUNT = 0 select ' + errmsg + ' else select ' + msg + ' GO ';

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    return this.appservice.post('CommonQuery/fnGetDataReportFromQuery', body)
  }

  public fnOrderDetailsGet(FromDate, ToDate): Observable<any> {
    let dTempAcId = this._localStorage.getItem('CusEShopId');
    var ServiceParams = {};
    ServiceParams['strProc'] = 'EShopOrderMainDatewise_AcId';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'AcId';
    ProcParams['strArgmt'] = dTempAcId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = ToDate;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    return this.appservice.post('CommonQuery/fnGetDataReportNew', body)
      .map((response) => response);

  }

  ongetmainOrder(id): Observable<any> {
    let dSessionBranchId = this._localStorage.getItem('BranchId');
    let strQuery = "select * from EShopOrderMain where OrderMain_Id = " + id + " and Order_Cancel = 0 and BranchId=" + dSessionBranchId;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    return this.appservice.post('CommonQuery/fnGetDataReportFromQuery', body)
  }
  public onOrderDetailsGetonAcid(CusId): Observable<any> {
    let dTempAcId = this._localStorage.getItem('CusEShopId');
    let ServiceParams = {};
    ServiceParams['strProc'] = 'EshopOrderDetails_OrderId';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'AcId';
    ProcParams['strArgmt'] = dTempAcId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'OrderMain_Id';
    ProcParams['strArgmt'] = CusId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appservice.post('CommonQuery/fnGetDataReportNew', body)
      .map((response) => response);

  }

  onBillingAddressSave(values, CustId, password, branchId): Observable<any> {
    let address1 = values['address1'];
    let address2 = values['address2'];
    let city = values['city'];
    let company = values['company'];
    let countryCode = values['country'];
    let email = values['email'];
    let firstName = values['firstName'];
    let lastName = values['lastName'];
    let middleName = values['middleName'];
    let phone = values['phone'];
    let state = values['state'];
    let zip = values['zip'];
    let varArguements = {};
      varArguements = {
        'CustId': CustId, 'CustName': firstName, 'Gender': '', 'CustType': '',
        'Address': address1, 'Phone1': phone, 'Phone2': '', 'Fax': '',
        'Mail': email, 'ContactPerson': city, 'Active': '', 'Points': '',
        'CustGrpID': '', 'CustPhoto': '', 'Remarks': '', 'DOB': '', 'Area_Description': '', 'Expired': '',
        'BranchCode': countryCode, 'Subscription': '', 'ICNo': '', 'DOBDay': '', 'DOBMonth': '',
        'DOBYear': '', EditDate: '', 'PCode': zip, 'FirstName': firstName, 'LastName': lastName,
        'CategoryID': '', IntroID: '', 'ProductPoint': 0, 'ServicePoint': '', 'Staff': '',
        'Alias': zip, PagProductPoint: 0, 'ImageLoc': '', 'Height': 0, 'Weight': 0,
        'AreaId': 0, 'MaritalStatus': '', 'Race': '', Occupation: '', 'bSelect': '',
        'Blacklisted': '', 'LostCard': '', 'Password': "", 'UniqueDeviceId': firstName, 'FacebookId': '',
        'FbAcessTokens': '', 'PicUrl': '', 'SquarePicUrl': '', 'ProfileDescription': '', 'CurrentLocationLat': '',
        'CurrentLocationLong': state, DLNo1: '', 'DLNo2': '', 'Tin1': '', 'Tin2': '', 'CstNo1': '', 'CrLmtDays': '',
        'CrLmtAmt': '', 'StaffId': 0, 'Address1': address2, 'PriceMenuId': 1, 'BranchId': branchId, 'Media': 0

      };
      var DictionaryObject = {};
      DictionaryObject['dictArgmts'] = varArguements;
      DictionaryObject['ProcName'] = 'Customer_UpdateEShop';

      let body = JSON.stringify(DictionaryObject);

    return this.appservice.post('OnlineShopV1/Customer_Update', body);
  }

  confirmPassword(acName, pwd, branchId): Observable<any> {
    let varArguements = {};
    varArguements = { Mail: acName, password: pwd, BranchId: Number(branchId) };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'Customer_GetforEshop';

    let body = JSON.stringify(DictionaryObject);
    return this.appservice.post('OnlineShopV1/Customer_GetforEshop', body)
  }

  onAcIdValidate(AcId): Observable<any> {
    let strQuery = 'select * from Customer where ACId =' + AcId;
    let objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);

    return this.appservice.post('CommonQuery/fnGetDataReportFromQuery', body)
  }

  onShippingAddressGet(AcId): Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'ShippingDetails_GetOnAcId';
    ServiceParams['JsonFileName'] = 'JsonScriptFour';
    let oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsAcId';
    ProcParams['strArgmt'] = AcId.toString();
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appservice.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)

  }

  onShippingInsertAndUpdate(value, acid, shipId): Observable<any> {
    // ParamsShippingDetails_Id is 0 to insert otherwise update
    let address1 = value.address1;
    let address2 = value.address2;
    let address3 = value.address3;
    let city = value.city;
    let company = value.company;
    let country = value.country.code;
    let email = value.email;
    let firstName = value.firstName;
    let lastName = value.lastName;
    let middleName = value.middleName;
    let phone = value.phone;
    let state = value.state;
    let zip = value.zip;
    let deliveryPoint = value.deliveryPoint;
    let deliveryTime = value.deliveryTime;

    let ServiceParams = {};
    ServiceParams['strProc'] = 'ShippingDetails_InsertOrUpdate';
    ServiceParams['JsonFileName'] = 'JsonScriptFour';
    let oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_Id';
    ProcParams['strArgmt'] = String(shipId);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsAcId';
    ProcParams['strArgmt'] = String(acid);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_FirstName';
    ProcParams['strArgmt'] = firstName;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_LastName';
    ProcParams['strArgmt'] = lastName;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_MiddleName';
    ProcParams['strArgmt'] = middleName;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_DeliveryPoint';
    ProcParams['strArgmt'] = deliveryPoint;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_EmailId';
    ProcParams['strArgmt'] = email;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_PhoneNo';
    ProcParams['strArgmt'] = String(phone);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_Country';
    ProcParams['strArgmt'] = country;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_City';
    ProcParams['strArgmt'] = city;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_State';
    ProcParams['strArgmt'] = state;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_Pincode';
    ProcParams['strArgmt'] = String(zip);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_Addr1';
    ProcParams['strArgmt'] = address1;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_Addr2';
    ProcParams['strArgmt'] = address2;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_Addr3';
    ProcParams['strArgmt'] = address3;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_DeliveryTime';
    ProcParams['strArgmt'] = deliveryTime;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    return this.appservice.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body);

  }

  onRemoveShippingAddress(shipId) {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'ShippingDetails_Delete';
    ServiceParams['JsonFileName'] = 'JsonScriptFour';
    let oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsShippingDetails_Id';
    ProcParams['strArgmt'] = String(shipId);
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appservice.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)

  }
}
