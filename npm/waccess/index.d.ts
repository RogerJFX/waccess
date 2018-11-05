export interface IWaccess {

  init();

  activateWaccess();

  focusElement(query: string);

  scanAgain();

}

export var Waccess: IWaccess;
