import { browser, by, element } from 'protractor';

export class AppPage {
  getParagraphText(): any {
    throw new Error('Method not implemented.');
  }
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }
}
