import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import UserClient from "@flock-community/flock-eco-feature-user/src/main/react/user/UserClient.ts";
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

export function UserSelector(props) {
  const { embedded, onChange, label, selectedItem } = props;
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    UserClient.findAllUsers("", 0, 100).then((res) => setUsers(res.list));
    setSelected(selectedItem);
  }, []);

  function handleChange(event) {
    // eslint-disable-next-line no-shadow
    const selected = event.target.value;
    setSelected(selected);
    onChange(selected);
  }

  function renderMenuItem(user, key) {
    return (
      <MenuItem key={`user-selector-menu-item-${key}`} value={user.code}>
        {user.name} &lt;{user.email}&gt;
      </MenuItem>
    );
  }

  const selectInput = (
    <FormControl fullWidth>
      <InputLabel shrink>{label}</InputLabel>
      <Select value={selected || ""} displayEmpty onChange={handleChange}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {users.map(renderMenuItem)}
      </Select>
    </FormControl>
  );

  return embedded ? (
    <div>{selectInput}</div>
  ) : (
    <Card>
      <CardContent>{selectInput}</CardContent>
    </Card>
  );
}

UserSelector.propTypes = {
  embedded: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  selectedItem: PropTypes.string,
};

UserSelector.defaultProps = {
  embedded: false,
  selectedItem: "",
  label: "Select User",
};
