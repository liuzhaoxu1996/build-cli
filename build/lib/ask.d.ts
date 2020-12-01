import async from "async";
export default function ask(prompts: {
    [x: string]: {
        when: string;
        default: {
            bind: (arg0: any) => {
                (arg0: any): any;
                new (): any;
            };
        };
        type: string | number;
        message: any;
        label: any;
        choices: any;
        validate: any;
    };
}, data: {
    [x: string]: any;
}, done: async.ErrorCallback<Error>): void;
