/*
Last Author: K1llf0rce
Date: 05.06.2021
*/

//exec in strict mode
'use strict'

fetch('http://pi.hole/admin/api.php')
  .then(response => response.json())
  .then(fetchtData => console.log(fetchtData.status));