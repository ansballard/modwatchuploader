import service from "./toast.service";

angular
.module("uploader.toast", [])
.factory("Toast", service);
