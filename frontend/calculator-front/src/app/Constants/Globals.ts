import { HttpHeaders } from "@angular/common/http";

export const DEFAULT_SHOP_ID:number = 5;
export const HTTP_TEST_TOKEN_AUTH = 'tokenTest123';
export const DEFAULT_AUTH_HEADER = new HttpHeaders().set('Authorization', HTTP_TEST_TOKEN_AUTH);