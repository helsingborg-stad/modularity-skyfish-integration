import {Dropdown, Button} from 'hbg-react';
import {capitalizeFirstLetter} from '../Helper/text.js';

module.exports = (props) => {
    const Keywords = (props) => {
        const {words} = props;

        if (typeof(words) != 'object' || Object.values(words).length <= 0) {
            return null;
        }

        let keywords = Object.values(words).map((word, index) => (<span key={index}>#{word} </span>));

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
        let {list} = props;

        //Remove empty values
        Object.entries(list).forEach(([key, value]) => {
            if (value.length <= 0) {
                delete list[key];
            }
        });

        if (typeof(list) == 'undefined' || Object.values(list).length <= 0) {
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

    return (
        <div>
            <div className="grid">
                <div className="grid-xs-12 u-mb-3">
                    <div className="skyfish-module__goback">
                        <Button color="palette-2" onClick={props.action.goBack || null}>
                            <i className="pricon pricon-back"></i>
                            Go back
                        </Button>
                    </div>
                </div>
                <div className="grid-xs-12 grid-md-auto u-mb-3">
                     <img className="u-w-100" src={props.data.preview || ''} />
                </div>
                <div className="grid-xs-12 grid-md-5 grid-lg-4 u-mb-3">
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

