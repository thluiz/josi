export class DatabaseParameterFacility {
    static build(key:string, value:any) {
        let obj = new Object();
        obj[key] = value;
        
        return obj;
    }
}