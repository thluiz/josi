import "reflect-metadata";
import { injectable } from "../../../node_modules/inversify";

@injectable()
export class DataRunningConfiguration<T = any> {
    useTransaction: boolean = false;
    shouldCommit: boolean = false;
}
