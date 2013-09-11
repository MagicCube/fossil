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
    <div id="intro" style="display: none;">
        <div id="welcomeTo">Welcome to</div>
        <div id="title">
            The Fossil Project
        </div>
        <div id="description">
            The simplest definition is "the study of ancient life". Paleontology seeks information about several aspects of past organisms: "their identity and origin, their environment and evolution, and what they can tell us about the Earth's organic and inorganic past".
        </div>
    </div>
</body>

<script>
$import("fo.App");

$speed = "fas";
if (!mx.debugMode)
{
    $speed = "normal";
}
mx.whenReady(function()
{
    fo.app = new fo.App();
    
    if ($speed == "fast")
    {
        fo.app.homeSceneName = "TaxonDetail";
    }
    else
    {
        fo.app.homeSceneName = "Welcome";
    }

    var args = { };
    fo.app.run(args);
});
</script>
</html>
