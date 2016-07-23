import service from "./toast.service";

angular
.module("uploader.toast", ["ngMaterial"])
.factory("Toast", service);
