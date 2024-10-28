/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import usePermission from "../../hooks/usePermission";
import useUserCurrent from "../../hooks/useUserCurrent";
const Profile = ({ user }) => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sellerPermission, isPermissionLoading] = usePermission("seller_pages");
  const handleLogout = () => {
    logOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        // Handle error
      });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Cài đặt">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 42, height: 42 }}>
              {user.photoURL ? (
                <img alt="avatar" src={user.photoURL} />
              ) : (
                <img alt="avatar" src="/images/user.png" />
              )}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 22,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Link to="/user/update-profile">
          <MenuItem onClick={handleClose}>
            <Avatar fontSize="small" sx={{ width: 32, height: 32 }}>
              {user.photoURL ? (
                <img alt="avatar" src={user.photoURL} />
              ) : (
                <img alt="avatar" src="/images/user.png" />
              )}
            </Avatar>{" "}
            Tài khoản của tôi
          </MenuItem>
        </Link>
        <Divider />
        <Link to="/user/orders">
          <MenuItem>
            <ListItemIcon>
              <FaCartShopping />
            </ListItemIcon>
            Đơn mua
          </MenuItem>
        </Link>
        {sellerPermission && (
          <Link to="/seller">
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <MdOutlineAdminPanelSettings />
              </ListItemIcon>
              Shop của tôi
            </MenuItem>
          </Link>
        )}

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Profile;
