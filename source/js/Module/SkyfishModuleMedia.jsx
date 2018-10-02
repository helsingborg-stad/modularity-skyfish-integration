module.exports = (props) => {
    // console.log(props);
    return (
        <div className="grid-xs-6 grid-md-3">
            <div className="c-card c-card--skyfish">
                <img
                    className="c-card__image"
                    onClick={props.clickImage}
                    onMouseOver={props.hoverImage}
                    src={props.source} data-media-object={JSON.stringify(props.object)}
                />
                <div className="c-card__footer">
                    <div className="grid">
                        <div className="grid-xs-auto">
                            {props.object.name}
                        </div>
                        <div className="grid-fit-content">
                            <a onClick={props.clickDownload} href={props.object.download || ''} data-media-object={JSON.stringify(props.object)} className="c-card__link">Download</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
