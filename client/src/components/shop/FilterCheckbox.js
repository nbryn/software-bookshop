import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
});

class FilterCheckbox extends React.Component {
  state = {
    checked: [0]
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState(
      {
        checked: newChecked
      },
      () => {
        this.props.handleFilters(newChecked);
      }
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <List className={classes.root}>
        <ListItemText primary={this.props.title} />
        {this.props.list
          ? this.props.list.map(value => (
              <ListItem
                key={value}
                role={undefined}
                dense
                button
                onClick={this.handleToggle(value)}
              >
                <Checkbox
                  checked={this.state.checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText
                  className="FilterCheckBox-Value"
                  primary={value.name ? value.name : value.fullName}
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Comments" />
                </ListItemSecondaryAction>
              </ListItem>
            ))
          : null}
      </List>
    );
  }
}

FilterCheckbox.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilterCheckbox);