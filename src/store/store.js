import { observable } from "mobx";

const myGlobal = observable({
  publicUrl: "http://93.179.103.52:5000",
  mockUrl: "https://sp.tkfun.site/mock/14"
});

export default myGlobal;
