
function Card(props){
  return (
    // <div className="card bg-base-100 shadow-xl">
    //   <div className="card-body">
    //     {props.children}
    //   </div>
    // </div>
    <div className="card bg-base-100 shadow-xl">
      {props.children}
      <div className="card-body">
        <h2 className="card-title">
          {props.title}
        </h2>
      </div>
    </div>
  );
}

export default Card;

//ffmpeg -y -i flame.avi -f lavfi -i anullsrc=channel_layout=mono:sample_rate=44100 -shortest h.avi
