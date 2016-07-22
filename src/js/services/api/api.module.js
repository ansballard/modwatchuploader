import service from "./api.service";

angular
.module("uploader.api", [])
.factory("API", service);
