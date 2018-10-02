module.exports = (props) => {
    let dynamicProps = {};

    if (typeof(props.classes) != 'undefined') {
        dynamicProps.className = props.classes;
    }

    if (typeof(props.href) != 'undefined') {
        dynamicProps.href = props.href;
    }

    if (typeof(props.clickAction) != 'undefined') {
        dynamicProps.onClick = props.clickAction;
    }

    return (
        <a {...dynamicProps}>{props.title}</a>
    );
}
