export default function generate(name: any, src: string, dest: string, done: (arg0: Error) => void): object & {
    destDirName: any;
    inPlace: boolean;
    noEscape: boolean;
};
