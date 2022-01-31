import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Backdrop,
  Fade,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useGlobal } from "app/context/globalContext";
import "material-react-toastify/dist/ReactToastify.css";
import { useProfile } from "pages/profile/[username]";
import banner3 from "app/images/banner3.jpg";
import cover2 from "app/images/cover2.jpg";

interface props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangeBannerModal = ({ isOpen, setIsOpen }: props) => {
  const { profileUser: userInfo } = useProfile();
  const [userBannerId, setUserBannerId] = useState(userInfo.get("cover"));
  const { dispatch } = useGlobal();
  const handleClose = (event, reason) => {
    setIsOpen(false);
  };

  const setUserProfileBanner = (bannerId: number) => {
    userInfo.set("cover", bannerId);
    userInfo.save().then((res) => {
        dispatch({
          type: "SET_USERINFO",
          value: res,
        });
      });
  }
  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40rem",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    color: "white",
  };
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      disableEscapeKeyDown
    >
      <Fade in={isOpen} timeout={500}>
        <Box sx={modalStyle}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Select a banner type
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={userBannerId.toString()}
              name="radio-buttons-group"
              onChange={(e)=>setUserBannerId(parseInt(e.target.value))}
            >
              <Box sx={{
                display:"grid",
                gridTemplateColumns:"auto auto",
                gap:"1vw",
                backgroundColor:"#0c0c0c",
                padding:"1rem"
                }}>
              <Box>
                <FormControlLabel control={<Radio/>} value="0" label="Default"/>
                <img src={`${banner3.src}`} width={300} alt="" />
              </Box>
              <Box>
                <FormControlLabel control={<Radio/>} value="1" label="New Banner1"/>
                <img src={cover2.src} width={300} alt="" />
              </Box>
              </Box>
            </RadioGroup>
          </FormControl>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2,width:"100%" }}>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => {setUserBannerId(userInfo.get("cover"));setIsOpen(false);}}
            sx={{ mr: "auto", color: "#f45151" }}
            id="bCancel"
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (!userBannerId) setUserProfileBanner(userBannerId);
              else setUserProfileBanner(userBannerId);
              setIsOpen(false);
            }}
            id="bApprove"
          >
            Save
          </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
export default ChangeBannerModal;
