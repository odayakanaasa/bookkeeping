import React, { PropTypes, Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableHeaderColumn, TableRow, TableHead, TableCell, TableBody } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';

const styles = theme => ({
  mobileHiddenCol: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
})

class CustomPopover extends Component {
  state = {
    isDeleteCoverVisible: false
  }

  onDeleteClick = () => {
    this.setState({ isDeleteCoverVisible: true })
  }

  onConfirmDeleteClick = () => {
    const { deleteCategory } = this.props

    this.confirmationClose()

    deleteCategory()
  }

  confirmationClose = () => {
    this.setState({ isDeleteCoverVisible: false })
  }

  onClose = () => {
    const { handleToolbarClose } = this.props

    this.confirmationClose()

    handleToolbarClose()
  }

  render () {
    const {
      category,
      isToolbarOpen,
      handleToolbarClose,
      toolbarAnchorEl,
      deleteCategory,
      updateCategory,
      changeName
    } = this.props
    const { isDeleteCoverVisible } = this.state

    return (
      <Popover
        open={isToolbarOpen}
        onClose={this.onClose}
        anchorEl={toolbarAnchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        {isDeleteCoverVisible
          ?
            <div>
              <p style={{ textAlign: 'center' }}>Are you sure?</p>
              <Button
                raised
                style={{ margin: 12 }}
                onClick={this.confirmationClose}
              >
                Back
              </Button>
              <Button
                raised
                color="accent"
                style={{ margin: 12 }}
                onClick={this.onConfirmDeleteClick}
              >
                Yes
              </Button>

            </div>
          :
            <div>
              <p style={{ fontSize: 11, textAlign: 'center' }}>Category: ID {category.id}</p>
              <Divider />
              <div style={{ textAlign: 'center' }}>
                <TextField inputStyle={{ textAlign: 'center' }} value={category.name} onChange={changeName} hintText="Name" style={{ width: 100 }} />
              </div>
              <div>
                <Button
                  raised
                  style={{ margin: 12 }}
                  onClick={this.onDeleteClick}
                >
                  Remove
                </Button>
                <Button
                  color="accent"
                  raised
                  style={{ margin: 12 }}
                  onClick={updateCategory}
                >
                  Edit
                </Button>
              </div>
            </div>
        }
      </Popover>
    )
  }
}

class CategoryTable extends Component {
  state = {
    isToolbarOpen: false,
    toolbarAnchorEl: null,
    toolbarCategory: { id: null, name: null, date: null },
  }

  handleToolbarOpen = (event, rowIndex) => {
    this.setState({
      isToolbarOpen: true,
      toolbarAnchorEl: event.target,
      toolbarCategory: this.props.categories[rowIndex],
    });
  }

  handleToolbarClose = (event) => {
    this.setState({
      isToolbarOpen: false,
      toolbarCategory: { id: null, name: null },
    });
  }

  deleteCategory = () => {
    this.props.deleteCategory(this.state.toolbarCategory.id);
    this.handleToolbarClose();
  }

  updateCategory = (event) => {
    const { updateCategory } = this.props
    const { toolbarCategory }  = this.state

    updateCategory(toolbarCategory.id, { name : toolbarCategory.name });
    this.handleToolbarClose();
  }

  changeName = (event) => {
    this.setState({ toolbarCategory: { id: this.state.toolbarCategory.id, name: event.target.value, date: this.state.toolbarCategory.date } });
  }

  render() {
    const { categories, classes } = this.props;
    const { toolbarCategory, isToolbarOpen, toolbarAnchorEl } = this.state

    return (
      <div>
        <h3 style={{ textAlign: 'center' }}>
          Categories
        </h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell tooltip="ID">ID</TableCell>
              <TableCell tooltip="Name">Name</TableCell>
              <TableCell tooltip="Date" className={classes.mobileHiddenCol}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            displayRowCheckbox={false}
            showRowHover
            stripedRows
          >
            {categories.map((item, index) =>
              <TableRow key={index}>
                <TableCell onClick={(e) => this.handleToolbarOpen(e, index)}>
                  {item.id}
                </TableCell>
                <TableCell onClick={(e) => this.handleToolbarOpen(e, index)}>
                  {item.name}
                </TableCell>
                <TableCell onClick={(e) => this.handleToolbarOpen(e, index)} className={classes.mobileHiddenCol}>
                  {item.date}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <CustomPopover
          category={toolbarCategory}
          isToolbarOpen={isToolbarOpen}
          handleToolbarClose={this.handleToolbarClose}
          toolbarAnchorEl={toolbarAnchorEl}
          deleteCategory={this.deleteCategory}
          updateCategory={this.updateCategory}
          changeName={this.changeName}
        />
      </div>
    );
  }
}

CategoryTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CategoryTable);
