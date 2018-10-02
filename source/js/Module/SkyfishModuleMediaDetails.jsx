const Keywords = (props) => {
    if (typeof(props.words) == 'undefined' || props.words.length <= 0) {
        return null;
    }

    let keywords = props.words.map((word) => (<span>#{word} </span>));

    return (
        <div>
            <h4>Keywords</h4>
            {keywords}
        </div>
    );
};

const Downloads = (props) => {

    console.log(props.sizes);
    // console.log(Object.keys(props.sizes));
    // console.log(Object.keys(props.values));
    // let downloads = props.sizes.map((size) => {
    //     console.log(size);
    // });

    return (<h1>Downloads</h1>);
}

module.exports = (props) => (
    <div>
        <div className="grid">
            <div className="grid-xs-12">
                <a onClick={props.action.goBack || null}>
                    <i className="pricon pricon-back"></i>
                    <h4>{props.data.title || ''}</h4>
                    <span>Publicerad: {props.data.publishDate || ''} </span>
                </a>
            </div>
            <div className="grid-xs-12 grid-md-auto">
                 <img className="u-w-100" src={props.data.preview || ''} />
            </div>
            <div className="grid-xs-12 grid-md-4">
                <article>
                <h4>{props.data.title || ''}</h4>
                <p>{props.data.description || ''}</p>
                <Keywords words={props.data.keywords || []} />
                <Downloads sizes={props.data.sizes || []} />
                <button className="btn btn-primary btn-block">Ladda ner</button>
                </article>
            </div>
        </div>
    </div>
);

