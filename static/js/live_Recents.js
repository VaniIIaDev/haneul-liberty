var isAllowRequestList = true;

// Function to show recent list for the provided parent element from /sidebar.json
function ShowAjaxRecentList(parent) {
    function temp() {
        jQuery.ajax({
            url: "/sidebar.json", // URL to fetch recent changes
            dataType: 'json'
        }).done(function(res) {
            var html = "";
            for (var i = 0; i < res.length && i < 10; i++) {
                var item = res[i];
                html += `<li><span class='recent-item'>`;
                var time = new Date(item.date * 1000);
                var year = time.getFullYear();
                var month = time.getMonth() + 1;
                var day = time.getDate();
                var hour = time.getHours();
                var minute = time.getMinutes();
                var second = time.getSeconds();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                if (hour < 10) {
                    hour = "0" + hour;
                }
                if (minute < 10) {
                    minute = "0" + minute;
                }
                if (second < 10) {
                    second = "0" + second;
                }
                var formattedTime = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
                html += "<small style='color: grey'><span class='fa fa-clock-o'></span> " + formattedTime + "</small><br><span class='fa fa-file-text-o'></span> " + `<a class='recent-item${item.status === 'delete' ? ' removed' : ''}' href='/w/${encodeURIComponent(item.document)}' title='${item.document}'>` + item.document + "</a></span></li>";
            }
            if (parent != null) {
                jQuery(parent).html(html);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching data from /sidebar.json:', textStatus, errorThrown);
        });
    }
    temp();
}

function ShowAjaxRecentDiscussList(parent) {
    function temp() {
        jQuery.ajax({
            url: "/api/sidebar", // URL to fetch recent changes
            dataType: 'json'
        }).done(function(res) {
            var html = "";
            // Handle discuss items
            for (var i = 0; i < res.discuss.length && i < 6; i++) {
                var item = res.discuss[i];
                html += `<li><span class='recent-item'>`;
                var time = new Date(item.date * 1000);
                var year = time.getFullYear();
                var month = time.getMonth() + 1;
                var day = time.getDate();
                var hour = time.getHours();
                var minute = time.getMinutes();
                var second = time.getSeconds();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                if (hour < 10) {
                    hour = "0" + hour;
                }
                if (minute < 10) {
                    minute = "0" + minute;
                }
                if (second < 10) {
                    second = "0" + second;
                }
                var formattedTime = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
                html += "<small style='color: grey'><span class='fa fa-clock-o'></span> " + formattedTime + "</small><br>" + "<span class='fa fa-file-text-o'></span> " + `<a class="recent-item" href="/w/${encodeURIComponent(item.document)}" title="${item.document}">` + item.document + "</a><br><span class='fa fa-comments-o'></span>" + ` <a class="recent-item" href="/thread/${item.slug}" title="${item.topic}">` + item.topic + " (" + item.status + ")</a>";

                // 최신 댓글 정보 추가
                if (item.recent_comment) {
                    var commentTime = new Date(item.recent_comment.time * 1000);
                    var commentYear = commentTime.getFullYear();
                    var commentMonth = commentTime.getMonth() + 1;
                    var commentDay = commentTime.getDate();
                    var commentHour = commentTime.getHours().toString().padStart(2, '0');
                    var commentMinute = commentTime.getMinutes().toString().padStart(2, '0');
                    var commentSecond = commentTime.getSeconds().toString().padStart(2, '0');
                    if (commentMonth < 10) {
                        commentMonth = "0" + commentMonth;
                    }
                    if (commentDay < 10) {
                        commentDay = "0" + commentDay;
                    }
                    var commentTimeString = commentYear + "/" + commentMonth + "/" + commentDay + " " + commentHour + ":" + commentMinute + ":" + commentSecond;
                    var commentContent = item.recent_comment.content.length > 20 ? item.recent_comment.content.substring(0, 20) + "..." : item.recent_comment.content;
                    html += `<br><small style="color: grey"><span class='fa fa-commenting-o'></span><a class="recent-item" style="font-size: unset" href="/thread/${item.slug}#${item.recent_comment.id}" title="${item.topic}"> [#${item.recent_comment.id} ${item.recent_comment.username}] ${commentContent}</a></small>`;
                } else {
                    console.log("최신 정보 없음");
                }
                html += `</span></li>`;
            }
            if (parent != null) {
                jQuery(parent).html(html);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching data from /api/sidebar:', textStatus, errorThrown);
        });
    }
    temp();
}



// Function to show recent list for the provided parent element from namgall API
function ShowAjaxRecentList2(parent) {
    function temp() {
        jQuery.ajax({
            url: "https://namgall.wikiing.in/api/open_recent_changes?channel=2", // Modified API URL
            dataType: 'json'
        }).done(function(res) {
            var html = "";
            for (var i = 0; i < res.length && i < 10; i++) {
                var item = res[i];
                html += '<li><a class="recent-item" href="'+ item[8] + encodeURIComponent(item[1]) + '" title="' + liberty_do_func_xss_encode(item[1]) + '">';
                html += "[" + liberty_do_func_xss_encode(item[2].replace(/^([^ ]+) /, '')) + "] " + "[" + liberty_do_func_xss_encode(item[7]) + "] ";
                var text = item[1];
                if (text.length > 18) {
                    text = text.substr(0, 18) + "...";
                }
                html += text;
                html += "</a></li>";
            }
            if (parent != null) {
                jQuery(parent).html(html);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching data from namgall API:', textStatus, errorThrown);
        });
    }
    temp();
}

function liberty_do_func_xss_encode(data) {
    data = data.replace(/'/g, '&#x27;');
    data = data.replace(/"/g, '&quot;');
    data = data.replace(/</g, '&lt;');
    data = data.replace(/>/g, '&gt;'); // Corrected the repeated '<' replacement
    return data;
}

// Vector-specific scripts
var recentIntervalHandle = null;
jQuery(function (jQuery) {
    var width = jQuery(window).width();
    if (width > 1023) {
        isAllowRequestList = true;
        ShowAjaxRecentList(jQuery("#live-recent-list"));
        ShowAjaxRecentDiscussList(jQuery("#live-recent-discuss-list"));
        ShowAjaxRecentList2(jQuery("#live-recent-list-2"));
    } else {
        isAllowRequestList = false;
    }

    // If the screen size is small and recent changes are not visible, do not refresh.
    jQuery(window).resize(recentIntervalCheck);
});

var recentIntervalCheck = function () {
    var width = jQuery(window).width();
    if (width <= 1023) {
        if (recentIntervalHandle != null) {
            clearInterval(recentIntervalHandle);
            recentIntervalHandle = null;
        }
        isAllowRequestList = false;
    } else {
        if (recentIntervalHandle == null) {
            recentIntervalHandle = setInterval(function () {
                ShowAjaxRecentList(jQuery("#live-recent-list"));
                ShowAjaxRecentDiscussList(jQuery("#live-recent-discuss-list"));
                ShowAjaxRecentList2(jQuery("#live-recent-list-2"));
            }, 60 * 1000);
        }
        isAllowRequestList = true;
    }
}

jQuery(document).ready(function (jQuery) {
    recentIntervalCheck();
});
