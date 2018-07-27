"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["NoError"] = 0] = "NoError";
    ErrorCode[ErrorCode["GenericError"] = 1] = "GenericError";
    ErrorCode[ErrorCode["FailedGetConnection"] = 2] = "FailedGetConnection";
    ErrorCode[ErrorCode["ExternalRequestError"] = 3] = "ExternalRequestError";
    ErrorCode[ErrorCode["ParcialExecution"] = 4] = "ParcialExecution";
    ErrorCode[ErrorCode["NothingChanged"] = 5] = "NothingChanged";
    ErrorCode[ErrorCode["IncidentsActions"] = 6] = "IncidentsActions";
    ErrorCode[ErrorCode["Firebase"] = 7] = "Firebase";
    ErrorCode[ErrorCode["UnhandledRejection"] = 8] = "UnhandledRejection";
    ErrorCode[ErrorCode["SessionControl"] = 9] = "SessionControl";
    ErrorCode[ErrorCode["SendingEmail"] = 10] = "SendingEmail";
    ErrorCode[ErrorCode["ExternalResource"] = 11] = "ExternalResource";
    ErrorCode[ErrorCode["CardsActions"] = 12] = "CardsActions";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
//# sourceMappingURL=errors-codes.js.map