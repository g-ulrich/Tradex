import React, {useState, Fragment, useRef, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';
import {IconCog, IconX} from '../Icons';


export default function SettingsLinkDialog() {
  const [openDialog, setOpenDialog] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [msgColor, setMsgColor] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const apiInputRef = useRef(null);
  const secretInputRef = useRef(null);
  const callbackInputRef = useRef(null);

  useEffect(() => {
    const delay = 10000;
    if (showMsg) {
      const timer = setTimeout(() => {
        setShowMsg(false);
      }, delay);

      const timer2 = setTimeout(() => {
        setSavedMsg("");
      }, delay +1000);

      return () => {clearTimeout(timer);clearTimeout(timer2);};
    }
  }, [showMsg]);

  const handleSave = () => {
    const form = {
      api: apiInputRef.current.value,
      secret: secretInputRef.current.value,
      callback: callbackInputRef.current.value
    }
    setMsgColor("bg-discord-red");
    setSavedMsg("Vals: " + form.api);
    setShowMsg(true);
    setOpenDialog(false);
  }

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Fragment>
        <div key='settings_routing' className="block text-center mt-[4px]">
            <span 
              onClick={handleClickOpen}
                title='settings' 
                className="absolute bottom-0 left-0 px-[10px] py-[4px] text-lg hover:bg-discord-blurple hover:rounded cursor-pointer">
                <IconCog />
            </span>
        </div>
        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <div className="border-[1px] border-discord-darkGray w-[500px]">
            <div id="alert-dialog-title" className="bg-discord-black p-2 text-lg text-discord-white">
              <IconCog /> Settings
            </div>
            <div id="alert-dialog-description" className="p-2 bg-discord-darkerGray text-discord-white">
            <div className="flex mb-2">
              <label for="apiInput" className="block border border-discord-darkestGray bg-discord-blurple rounded-l px-2 py-[4px]">API</label>
              <input ref={apiInputRef} id="apiInput" type="text" className="grow border border-discord-darkestGray bg-discord-darkGray px-2 py-[4px] rounded-r focus:outline-none focus:border-discord-blurple" placeholder="Enter your API key"/>
            </div>

            <div className="flex mb-2">
              <label for="secretInput" className="block border border-discord-darkestGray bg-discord-blurple rounded-l px-2 py-[4px]">Secret</label>
              <input ref={secretInputRef} id="secretInput" type="password" className="grow border border-discord-darkestGray bg-discord-darkGray px-2 py-[4px] rounded- focus:outline-none focus:border-discord-blurple" placeholder="Enter your secret key"/>
            </div>

            <div className="flex">
              <label for="callbackInput" className="block border border-discord-darkestGray bg-discord-blurple rounded-l px-2 py-[4px]">Callback</label>
              <input ref={callbackInputRef} id="callbackInput" type="text" className="grow border border-discord-darkestGray bg-discord-darkGray px-2 py-[4px] rounded-r focus:outline-none focus:border-discord-blurple" placeholder="Enter your callback URL"/>
            </div>

            </div>
            <div className="p-2 justify-items-end bg-discord-darkerGray text-right text-discord-white">
              <span className="cursor-pointer px-2 py-[4px] rounded hover:bg-discord-blurple" onClick={handleSave} >Save</span>
            </div>
        </div>
      </Dialog>

      <div style={{left: '50%', trasnform: 'translateX(-50%)'}} className="absolute z-[999] bottom-0 mb-2 text-discord-white ">
        <Slide direction="up" in={showMsg} mountOnEnter unmountOnExit>
          <div className={`rounded px-2 py-[4px] ${msgColor}`} onClick={handleClose}>
            <span className="px-2 py-[4px]"><IconX /></span>
            {savedMsg}
          </div>
        </Slide>
      </div>

    </Fragment>
  );
}