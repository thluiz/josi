import to from "await-to-js";
import * as uuid from "uuid/v4";

import axios, { AxiosResponse } from "axios";
import { AzureSessionStore } from "../middlewares/azure-session-storage";

import { tryLogAsync } from "../decorators/trylog-decorator";
import { ErrorCode } from "../helpers/errors-codes";
import { ErrorResult, Result, SuccessResult } from "../helpers/result";

import { LoggerService } from "./logger-service";

export class JobsService {
    @tryLogAsync()
    async execute_hourly_jobs(): Promise<Result<void>> {
        const startTime = new Date().getTime();
        const key = uuid();
        LoggerService.benchmark(key, `Starting Running Jobs :: ${startTime }`);

        const results = [];

        results.push(await this.cleanup_sessions());

        const endTime = new Date().getTime();

        const err = results.find((r) => !r.success);

        LoggerService.benchmark(key, {
            startTime,
            success: err == null,
            endTime,
            duration: (endTime - startTime) / 1000,
            results
        });

        if (err) { return err; }

        return SuccessResult.GeneralOk();
    }

    @tryLogAsync()
    async cleanup_sessions(): Promise<Result<any>> {
        const storage = new AzureSessionStore({});

        try {
            await storage.cleanup();

            return SuccessResult.GeneralOk();
        } catch (error) {
            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }

    @tryLogAsync()
    async update_voucher_site(): Promise<Result<AxiosResponse>> {
        const [errVoucher, resultVoucher] = await to(axios.get(process.env.VOUCHER_SITE_UPDATE_URL));

        if (errVoucher || resultVoucher.status !== 200) {
            return ErrorResult.Fail(
                ErrorCode.ExternalRequestError,
                errVoucher || new Error(resultVoucher.statusText),
                null
            );
        }

        const [errInvites, resultInvites] = await to(
            axios.get(process.env.VOUCHER_SITE_UPDATE_INVITES_URL)
        );

        if (errInvites || resultInvites.status !== 200) {
            return ErrorResult.Fail(
                ErrorCode.ExternalRequestError,
                errInvites || new Error(resultInvites.statusText),
                null
            );
        }

        return SuccessResult.GeneralOk();
    }
}
