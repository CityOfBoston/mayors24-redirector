# mayors24-redirector
Server to redirect mayors24.cityofboston.gov URLs to the new BOS:311 web portal

mayors24.cityofboston.gov hosts both a version of the Spot Reporters 311 app
(same as the existing 311.boston.gov site) and a Lagan eForms server.

 * Spot Reporters URLs are redirected as-is to 311.boston.gov (as we’re building
   Spot Reporters support into that code base).
 * EForms URLs we try to match to new service type codes and redirect to those.

While we hope that mayors24.cityofboston.gov will eventually stop being linked
to, we want this in the interim to be smooth during the transition
