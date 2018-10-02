module.exports = (props) => {
    return (
        <div className="c-dropdown__menu is-open">
            <ul className="o-dropdown-links">
                {props.children.map((child) => (<li>{child}</li>))}
            </ul>
        </div>
    );
}
