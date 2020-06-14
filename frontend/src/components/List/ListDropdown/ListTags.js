import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../../CustomComponents/Button/CustomButton";
import { getTags, updateTag } from "../../../API";
import {
  FaPlus,
  FaSearch,
  FaRegCheckSquare,
  FaRegSquare,
} from "react-icons/fa";

class ListTags extends React.Component {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
    this.state = {
      listStyle: this.props.style,
      tags: null,
      currentTags: this.props.currentTags.map((currentTag) => {
        return currentTag.id;
      }),
      searchInput: "",
      searchMatchesTagName: false,
    };
  }

  componentDidMount() {
    if (this.searchRef.current) {
      this.searchRef.current.focus();
    }
    this.getTags();
  }

  getTags = () => {
    getTags(
      (response) => {
        this.setState({
          tags: response.data,
        });
      },
      (error) => {
        console.log(error.response);
      }
    );
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.style !== prevState.listStyle) {
      var newStyle = {
        listStyle: nextProps.style,
      };
    }
    if (nextProps.currentTags !== prevState.currentTags) {
      var newCurrentTags = {
        currentTags: nextProps.currentTags.map((currentTag) => {
          return currentTag.id;
        }),
      };
    }
    return newStyle || newCurrentTags
      ? { ...newStyle, ...newCurrentTags }
      : null;
  }

  changeSearchMatchesTagName = (bool) => {
    this.setState({
      searchMatchesTagName: bool,
    });
  };

  handleSearchChange = (e) => {
    const search = e.target.value;
    this.setState({
      searchInput: search,
      searchMatchesTagName: false,
    });
  };

  renderCreateTagButton = () => {
    return (
      <div
        style={this.state.listStyle.listCreateTagButton(
          !this.state.searchMatchesTagName && this.state.searchInput
        )}
        onClick={() => {
          this.props.createNewTag(this.state.searchInput, () => {
            this.getTags();
            this.setState({
              searchInput: "",
            });
          });
        }}
      >
        <FaPlus></FaPlus>
        Create "{this.state.searchInput}"
      </div>
    );
  };

  renderTag = (tag, isCurrentTag) => {
    return (
      <ListTag
        //Tag Properties
        key={tag.id}
        name={tag.name}
        id={tag.id}
        isCurrentTag={isCurrentTag}
        //Other Properties
        style={this.state.listStyle}
        currentSearch={this.state.searchInput}
        //Functions
        addTag={this.props.addTag}
        removeTag={this.props.removeTag}
        changeSearchMatchesTagName={this.changeSearchMatchesTagName}
        updateListTags={this.props.updateListTags}
      ></ListTag>
    );
  };

  createTagList = () => {
    if (this.state.tags !== null) {
      let tags = [].concat(this.state.tags);
      let currentTags = [].concat(this.state.currentTags);
      return (
        <>
          {tags.map((tag, i) => {
            if (currentTags.length > 0 && currentTags.indexOf(tag.id) !== -1) {
              return this.renderTag(tag, true);
            }
            return this.renderTag(tag, false);
          })}
        </>
      );
    }
  };

  renderListTags = () => {
    return (
      <>
        <div style={this.state.listStyle.listTagSearchDiv}>
          <input
            autoFocus
            style={this.state.listStyle.listTagSearch}
            placeholder={"Enter Tag Name"}
            onChange={this.handleSearchChange}
            value={this.state.searchInput}
            ref={this.searchRef}
          ></input>
          <FaSearch style={this.state.listStyle.listTagSearchIcon}></FaSearch>
        </div>
        <div
          style={this.state.listStyle.listAllTags(
            !this.state.searchMatchesTagName && this.state.searchInput
          )}
        >
          {this.createTagList()}
        </div>
        {this.renderCreateTagButton()}
      </>
    );
  };

  render() {
    return this.renderListTags();
  }
}

export default ListTags;

ListTags.propTypes = {
  style: PropTypes.object.isRequired,
  updateListTags: PropTypes.func.isRequired,
  createNewTag: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  currentTags: PropTypes.array,
  addTag: PropTypes.func.isRequired,
};

class ListTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listStyle: this.props.listStyle,
      isCurrentTag: this.props.isCurrentTag,
      matchesSearch: true,
      hover: false,
      focus: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentSearch !== this.props.currentSearch) {
      this.checkIfMatchesSearch();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.style !== prevState.style) {
      var newStyle = {
        listStyle: nextProps.style,
      };
    }
    if (nextProps.isCurrentTag !== prevState.isCurrentTag) {
      var newIsCurrentTag = {
        isCurrentTag: nextProps.isCurrentTag,
      };
    }
    return newStyle || newIsCurrentTag
      ? { ...newStyle, ...newIsCurrentTag }
      : null;
  }

  toggleHover = (bool) => {
    if (bool && !this.state.hover) {
      this.setState({
        hover: bool,
      });
    } else if (!bool) {
      this.setState({
        hover: bool,
      });
    }
  };

  toggleFocus = (bool) => {
    if (bool && !this.state.focus) {
      this.setState({
        focus: bool,
      });
    } else if (!bool) {
      this.setState({
        focus: bool,
      });
    }
  };

  toggleCurrentTag = () => {
    if (this.state.isCurrentTag) {
      this.props.removeTag(this.props.id);
    } else {
      this.props.addTag(this.props.id);
    }
  };

  checkIfMatchesSearch = () => {
    const upperCaseName = this.props.name.toUpperCase();
    const upperCaseSearch = this.props.currentSearch.toUpperCase();
    if (upperCaseName.includes(upperCaseSearch)) {
      this.setState(
        {
          matchesSearch: true,
        },
        () => {
          if (upperCaseName === upperCaseSearch) {
            this.props.changeSearchMatchesTagName(true);
          }
        }
      );
    } else {
      this.setState({
        matchesSearch: false,
      });
    }
  };

  render() {
    return (
      <div
        style={this.state.listStyle.listListedTag(
          this.state.matchesSearch,
          this.state.hover,
          this.state.focus
        )}
        tabIndex="0"
        onMouseOver={() => {
          this.toggleHover(true);
        }}
        onMouseLeave={() => {
          this.toggleHover(false);
        }}
        onFocus={() => {
          this.toggleFocus(true);
        }}
        onBlur={() => {
          this.toggleFocus(false);
        }}
        onClick={() => {
          this.toggleCurrentTag();
        }}
      >
        {this.state.isCurrentTag ? (
          <FaRegCheckSquare style={this.state.listStyle.listTagCheckbox} />
        ) : (
          <FaRegSquare style={this.state.listStyle.listTagCheckbox} />
        )}
        <div style={this.state.listStyle.listTagName}>{this.props.name}</div>
      </div>
    );
  }
}

ListTag.propTypes = {
  //Tag Properties
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  isCurrentTag: PropTypes.bool.isRequired,
  //Other Properties
  style: PropTypes.object.isRequired,
  currentSearch: PropTypes.string.isRequired,
  //Functions
  addTag: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  changeSearchMatchesTagName: PropTypes.func.isRequired,
  updateListTags: PropTypes.func.isRequired,
};
