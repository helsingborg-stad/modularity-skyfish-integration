import {Dropdown} from 'hbg-react';

const Keywords = (props) => {
    if (typeof(props.words) == 'undefined' || props.words.length <= 0) {
        return null;
    }

    let keywords = props.words.map((word, index) => (<span key={index}>#{word} </span>));

    return (
        <div>
            <h4>Keywords</h4>
            {keywords}
        </div>
    );
};

const Downloads = (props) => {
    let sizes = [];
    //Map dropdown list items
    Object.entries(props.sizes).forEach(([key, value]) => {
        let size = {
            id: value.width > value.height ? value.width : value.height,
            title: key,
            key: value.id,
            onClickAction: props.onClickItem
        };

        sizes.push(size);
    });

    return (
        <Dropdown
            title="Download"
            list={sizes}
        />
    );
}

module.exports = (props) => {
    return (
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
                        <Downloads sizes={props.data.sizes || []} onClickItem={props.action.downloadImage} />
                    </article>
                </div>
            </div>
        </div>
    );
}

