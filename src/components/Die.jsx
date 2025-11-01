export default function Die(props) {
    const style = {
        backgroundColor: props.isHeld ? "lightGreen" : "white",
        color: props.isHeld ? "white" : "black",
    }

    return (
        <button onClick={props.toggleBox} style={style}>
            {props.value}
        </button>
    )
}
