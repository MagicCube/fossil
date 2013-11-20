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
        <div id="front">
            <div id="welcomeTo">Welcome to</div>
            <div id="title">
                The Fossil Project
            </div>
            <div id="description">
                The biggest stratigraphy database. The second biggest paleontology database. An application to "piece together all the time-lines of event in Earth history to get an optimized permutation of all the biological events."
                <br>Powered by SAP HANA.
            </div>
        </div>
        <div id="back" src="scripts/fo/res/images/helix.png"></div>
    </div>
</body>

<script>
$import("fo.DefaultApp");

$speed = "<%= request.getParameter("speed")%>";
if (!mx.debugMode)
{
    $speed = "normal";
}
mx.whenReady(function()
{
    fo.app = new fo.DefaultApp();
    
    if ($speed == "fast")
    {
        //fo.app.homeSceneName = "BioDiversity";
        fo.app.homeSceneName = "TaxonSequence";
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
