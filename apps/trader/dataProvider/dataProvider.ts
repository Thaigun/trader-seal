export abstract class DataProvider {
    abstract start(): Promise<void> | void;
}
