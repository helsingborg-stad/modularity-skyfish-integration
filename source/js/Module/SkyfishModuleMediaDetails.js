import {Dropdown} from 'hbg-react';
import {capitalizeFirstLetter} from '../Helper/text.js';

const Keywords = (props) => {
    if (typeof(props.words) == 'undefined' || props.words.length <= 0) {
        return null;
    }

    let keywords = props.words.map((word, index) => (<span key={index}>#{word} </span>));

    return (
        <div className="u-mt-3">
            <h4>Keywords</h4>
            <p>{keywords}</p>
        </div>
    );
};

const Downloads = (props) => {
    let sizes = [];
    //Map dropdown list items
    Object.entries(props.sizes).forEach(([key, value]) => {
        let size = {
            id: value.width > value.height ? value.width : value.height,
            title: capitalizeFirstLetter(key) + ' ' + value.format.toUpperCase() + ' (' + value.width + ' x ' + value.height + ')',
            key: value.id,
            onClickAction: props.onClickItem,
            'classes': 'link'
        };

        sizes.push(size);
    });

    return (
        <div className="u-mt-3">
        <Dropdown
            toggleClass="btn btn-primary btn-block"
            title="Download"
            list={sizes}
        />
        </div>
    );
}

const MetaList = (props) => {
    const {list} = props;

    if (typeof(list) == 'undefined' || list.length <= 0) {
        return null;
    }

    return (
        <div className="u-mt-3">
            <h4>Details</h4>
            <table>
                <tbody>
                    {Object.entries(list).map(([key, value]) => {
                        return (
                            <tr key={key}>
                                <td>{key + ': '}</td>
                                <td>{value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

module.exports = (props) => {
    return (
        <div>
            <div className="grid">
                <div className="grid-xs-12 u-mb-3">
                    <div className="skyfish-module__goback">
                        <span className="link" onClick={props.action.goBack || null}>
                        <i className="pricon pricon-back"></i>
                        Go back
                        </span>
                    </div>
                </div>
                <div className="grid-xs-12 grid-md-auto u-mb-3">
                     <img className="u-w-100" src={props.data.preview || ''} />
                </div>
                <div className="grid-xs-12 grid-md-4 u-mb-3">
                    <article>
                        <h2>{props.data.title || ''}</h2>
                        <p>{props.data.description || ''}</p>
                        <Keywords words={props.data.keywords || []} />
                        <Downloads sizes={props.data.sizes || []} onClickItem={props.action.downloadImage} />
                        <MetaList list={props.data.meta || {}} />
                    </article>
                </div>
            </div>
        </div>
    );
}

