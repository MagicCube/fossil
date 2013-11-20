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
            <div id="welcomeTo">欢迎来到</div>
            <div id="title">
             		   古生物项目
            </div>
            <div id="description">
                最大地层学数据库 | 第二大古生物数据库 | 综合地质事件年代，寻求生物事件最优排序 
                <br>由SAP HANA 提供技术支持.
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
