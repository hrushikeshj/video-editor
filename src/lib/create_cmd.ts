class File{
    name: string;
    constructor(file_name: string){
        this.name = file_name;
    }
}

class CreateCmd{
    global_args: string[];
    inputs: string[];
    outputs: string[];
    filter_complex: string;

    constructor(){
        this.global_args = [];
        this.inputs = [];
        this.outputs = [];
        this.filter_complex = "";
    }

    input(file_name: string){
        this.inputs = [...this.inputs, "-i", file_name];
        return this;
    }

    output(file_name: string){
        this.outputs.push(file_name);
        return this;
    }

    cmd(){
        return [...this.global_args, ...this.inputs, ...this.outputs];
    }

    clear(){
        this.global_args = [];
        this.inputs = [];
        this.outputs = [];
    }

    static nullAudio(){
        return ["-f", "lavfi", "-i", "anullsrc=channel_layout=mono:sample_rate=44100"];
    }

}

export default CreateCmd;
