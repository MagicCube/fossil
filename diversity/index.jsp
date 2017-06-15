<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="mx" tagdir="/WEB-INF/tags/mx"%>

<!DOCTYPE html>
<html>
<head>
<title>The Fossil Project</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<mx:Framework debugMode="true"/>
</head>

<body>
    <div id="projectLogo"></div>
</body>

<script>
$import("fo.DiversityApp");

mx.whenReady(function()
{
    fo.app = new fo.DiversityApp();
    var args = { };
    fo.app.run(args);
});
</script>
</html>
