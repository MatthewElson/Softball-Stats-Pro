import React, { useState, useEffect } from 'react';
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';

const ManageTeam = () => {

    const { teamName } = useParams();

    return <div>
        {/* add players
                players
                subs
            delete players
            
        */}
    </div>
}

export default ManageTeam;
