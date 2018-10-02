const DropdownList = require('./DropdownList.jsx')
const DropdownItem = require('./DropdownItem.jsx')
const DropdownToggle = require('./DropdownToggle.jsx')
const onClickOutside = require('react-onclickoutside').default;

//Enable spread operator
React.__spread = Object.assign;

//Class wrapped in onclickoutside HOC
module.exports = onClickOutside(class extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            listOpen: false
        }
    }

    handleClickOutside()
    {
        this.setState({
            listOpen: false
        });
    }

    toggleList()
    {
        this.setState((prevState) => ({listOpen: !prevState.listOpen}));
    }

    render()
    {
        const {list, toggleItem, title, toggleClass} = this.props;
        const {listOpen} = this.state;
        return (
            <div className="c-dropdown">
                <DropdownToggle
                    btnClass={toggleClass || "btn btn-primary"}
                    clickAction={() => this.toggleList()}
                    title={title}
                />

                {listOpen &&
                    <DropdownList>
                        {list.map((item, index) => {
                            if (typeof(item.title) == 'undefined') {
                                return null;
                            }

                            let id = item.id || index;
                            let key = item.key || '';

                            let props = {};

                            props.key = id;
                            props.title = item.title;

                            if (typeof(item.classes) != 'undefined') {
                                props.classes = item.classes;
                            }

                            if (typeof(item.href) != 'undefined') {
                                props.href = item.href;
                            } else if (typeof(item.clickAction) != 'undefined') {
                                props.clickAction = () => item.clickAction(id, key);
                            }

                            if (typeof(props.href) == 'undefined' && typeof(props.clickAction) == 'undefined') {
                                return null;
                            }

                            return (
                                <DropdownItem {...props} />
                            );
                        })}
                    </DropdownList>
                }
            </div>
        );
    }
})
