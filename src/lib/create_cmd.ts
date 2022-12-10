class File{
    name: string;
    constructor(file_name: string){
        this.name = file_name;
    }
}

class InputFile extends File{
    id?: number;
    constructor(file_name: string){
        super(file_name);
    }
}

type Filter = string[];
const AUDIO = "audio", VIDEO = "video", ALL = "all"
type StreamType = "audio" | "video" | "all";
type FileAndType = [File, StreamType]

function filter(f: string, ...args: string[]){
    return `${f}=${args.join(':')}`;
}

class CreateCmd{
    global_args: string[];
    inputs: File[];
    outputs: string[];
    filter_complex: string;
    input_files_map: WeakMap<File, number>;

    constructor(){
        this.global_args = [];
        this.inputs = [];
        this.outputs = [];
        this.filter_complex = "";
        this.input_files_map = new WeakMap();
    }

    input(file: File): CreateCmd{
        if(this.input_files_map.has(file)){
            throw "Duplicate input file";
        }

        this.input_files_map.set(file, this.inputs.length);
        this.inputs = [...this.inputs, file];
        
        return this;
    }

    global(...args: string[]): CreateCmd{
        this.global_args = [...this.global_args, ...args];
        return this;
    }

    output(file_name: string): CreateCmd{
        this.outputs.push(file_name);
        return this;
    }

    cmd(){
        let input_args = this.inputs.map(f => ["-i", f.name]).flat();
        return [...this.global_args, ...input_args, ...this.outputs];
    }

    clear(){
        this.global_args = [];
        this.inputs = [];
        this.outputs = [];
        this.input_files_map = new WeakMap();
    }

    static addAudioIfNotExists(file: string | File, outfile: string){
        let file_name: string;
        if(typeof file == "string")
            file_name = file;
        else
            file_name = file.name;
        
        return ["-i", file_name, ...CreateCmd.nullAudio(), "-shortest", outfile];
    }

    static nullAudio(){
        return ["-f", "lavfi", "-i", "anullsrc=channel_layout=mono:sample_rate=44100"];
    }

}

let f1 = new File('f1');
let f2 = new File('f2');

let c = new CreateCmd();

c.input(f1).input(f2)

window.ex = c;

export default CreateCmd;
