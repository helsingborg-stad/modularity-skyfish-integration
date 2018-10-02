module.exports = (props) => {
    let classes = (props.btnClass ? 'c-dropdown__toggle ' + props.btnClass : 'c-dropdown__toggle');
    return (
        <button
            className={classes}
            onClick={props.clickAction}>
            {props.children || props.title}
        </button>
    );
}
