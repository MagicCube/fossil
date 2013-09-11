<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ attribute name="debugMode" required="true" type="java.lang.Boolean" %>
<script type="text/javascript" src="<%= request.getContextPath()%>/scripts/lib/jquery/jquery.js"></script>
<% if (debugMode) {%>
<script type="text/javascript" src="<%= request.getContextPath()%>/scripts/mx/debug.js"></script>
<% } else {%>
<script type="text/javascript" src="<%= request.getContextPath()%>/scripts/mx/min.js"></script>
<%}%>