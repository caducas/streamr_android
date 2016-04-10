var currentAlbum;
var currentMpdId;

function configureUserAccounts() {
	getListOfUsers();
	getUserRoles();
	showSettingsConfigureUserAccountsArea();
}

function configureSongOrder() {
	getListOfArtistsForSongOrder();
	getListOfAlbumsForSongOrder();
	showSettingsChangeSongOrderInAlbumArea();
}

function configureMpds() {
	getSettingsListOfMpds();
	showSettingsManageMpdArea();
}

function configureManageAlbums() {
	getListOfArtistsForManageAlbums();
	showSettingsManageAlbums();
}

function createListOfUsers(data) {
  var userTableBody = document.createElement('tbody');
  userTableBody.id = 'userListBody';
  for(var i in data) {
    var userTableRow = document.createElement('tr');
    
    var userTableColumn = document.createElement('td');
    userTableColumn.appendChild(document.createTextNode(data[i].username));
    userTableRow.appendChild(userTableColumn);

    var userRoleTableColumn = document.createElement('td');
    userRoleTableColumn.appendChild(document.createTextNode(data[i].role));
    userTableRow.appendChild(userRoleTableColumn);

    var userEditColumn = document.createElement('td');
    var userEditButton = document.createElement('input');
    userEditButton.type = 'button';
    userEditButton.value = 'Edit';
	(function(id){
		userEditButton.addEventListener("click", function() {
			editUser(id);
		}, false);
	})(data[i].id);
    userEditColumn.appendChild(userEditButton);
    userTableRow.appendChild(userEditColumn);

    userTableBody.appendChild(userTableRow);
  }
  $('#userListBody').remove();
  $('#userList').append(userTableBody);

  showNewUserArea();
}

function setUserRolesList(data) {
  for(var i in data) {
  	addOptionToSelect(data[i].id, data[i].name, $('#modifyUserRole'));
  	addOptionToSelect(data[i].id, data[i].name, $('#createUserRole'));
  }
}

function editUser(id) {
	getUser(id);
}

function createUser() {
	var username = $('#createUserUsername').val();
	var password = CryptoJS.SHA512($('#createUserPassword').val()).toString(CryptoJS.enc.Hex);
	var role = $('#createUserRole').val();
	sendCreateNewUser(username, password, role);
}

function saveUser() {
	var username = $('#modifyUserUsername').val();
	var role = $('#modifyUserRole').val();
	var id = $('#modifyUserId').val();
	sendSaveExistingUser(id, username, role);
}

function resetPassword() {
	var enteredPassword = prompt('Please insert default password (should be changed by user then)','P@ssw0rd');
	if(enteredPassword == null) {
		return;
	}
	var password = CryptoJS.SHA512(enteredPassword).toString(CryptoJS.enc.Hex);
	var id = $('#modifyUserId').val();
	sendResetPassword(id, password);
}

function deleteUser() {
	var id = $('#modifyUserId').val();
	sendDeleteUser(id);	
}

function cancelEditUser() {
	$('#modifyUserId').val(null);
	$('#modifyUserUsername').val('');
	$('#modifyUserRole').val(null);
	showNewUserArea();
}

function setUserForModification(userdata) {
	$('#modifyUserId').val(userdata.id);
	$('#modifyUserUsername').val(userdata.username);
	$('#modifyUserRole').val(userdata.roleId);
	showEditUserArea();
}

function addOptionToSelect(id, value, select) {
    var option = document.createElement('option');
    option.value = id;
    option.appendChild(document.createTextNode(value));
    select.append(option);	
}

function cacheSongListForSongOrder(songlist) {
  currentAlbum = songlist;
}

function changeOrderInAlbum(originalIndex, finalIndex) {

  if(originalIndex!=finalIndex) {
    var cacheSong = currentAlbum[originalIndex];

    currentAlbum.splice(originalIndex,1);

    currentAlbum.splice(finalIndex,0,cacheSong);
  }
};

function saveMpd() {
  var id = $('#createMpdId').val();
  var name = $('#createMpdName').val();
  var ip = $('#createMpdIp').val();
  var port = $('#createMpdPort').val();

  sendSaveMpd(id, name, ip, port);
}

function cancelMpd() {
	resetNewMpdArea();
	hideNewMpdArea();
}

function modifyMpdEntryGeneral(id) {
  resetNewMpdArea();
  getMpdEntry(id);
}

function saveMpdSuccess() {
	resetNewMpdArea();
	hideNewMpdArea();
}

function setMpdForModification(mpddata) {
  var id = $('#createMpdId').val(mpddata.id);
  var name = $('#createMpdName').val(mpddata.name);
  var ip = $('#createMpdIp').val(mpddata.ip);
  var port = $('#createMpdPort').val(mpddata.port);
}

function deleteMpd(id) {
	sendDeleteMpd(id);		
}

function modifyMpdEntryPermissions(id) {
	resetNewMpdArea();
	hideNewMpdArea();
	getMpdEntryPermissions(id);
}

function allowMpdForUser() {
	var id = $('#mpdPermissionsAllowUserSelect').val();
	sendAllowMpdForUser(currentMpdId, id);
}

function denyMpdForUser(mpdId, userId) {
	sendDenyMpdForUser(mpdId, userId);
}

function cacheSelectedMpd(data) {
	currentMpdId = data.id;
}