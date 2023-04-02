class File{
    name: string;
    constructor(file_name: string){
        this.name = file_name;
    }
}


interface InputFile{
    title: string,
    url: string,
    fileName: string,
    [key: string]: any
}

type Filter = string[];
const AUDIO = "audio", VIDEO = "video", ALL = "all"
type StreamType = "audio" | "video" | "all";
type FileAndType = [File, StreamType]

function filter(f: string, ...args: string[]){
    return `${f}=${args.join(':')}`;
}

function filter_chain(file){

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

    static joinVideos(files: InputFile[]){
        const filter = (i: number) => `[${i}]scale=480:360:force_original_aspect_ratio=decrease,pad=480:360:(ow-iw)/2:(oh-ih)/2,setsar=1[v${i}]`;

        let cmd = new CreateCmd();
        cmd.global("-vsync", "2");

        files.forEach(f => cmd.global("-i", f.fileName));
        cmd.global("-filter_complex");

        let filter_chain = files.map((f, i) => filter(i));
        let concat = files.map((f, i) => `[v${i}][${i}:a]`).join('') + `concat=n=${files.length}:v=1:a=1[v][a]`;
        filter_chain.push(concat);
    
        cmd.global(filter_chain.join(';'))
        cmd.global("-map", "[v]", "-map", "[a]", "output.mp4");
        return cmd.cmd();
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

    static exportVideo(format: string){
        return ["-i", "src_video.mp4", `output.${format}`]
    }

}

let f1 = new File('f1');
let f2 = new File('f2');

let c = new CreateCmd();

c.input(f1).input(f2)

window.ex = c;

let ip: InputFile[] = [
    {
        title: 'v1',
        url: 'url',
        fileName: "f1"
    },
    {
        title: 'v1',
        url: 'url',
        fileName: "f2"
    },
    {
        title: 'v1',
        url: 'url',
        fileName: "f3"
    }
]
//console.log(CreateCmd.joinVideos(ip)[9]);

export default CreateCmd;
