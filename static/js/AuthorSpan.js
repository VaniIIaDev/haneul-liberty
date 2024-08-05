window.onload = function() {
    document.querySelectorAll("a[href^='/w/사용자:']").forEach(item => {
        const popover = document.createElement('div');
        popover.style.display = 'none';
        popover.style.zIndex = 9999;
        popover.style.position = 'absolute';
        popover.style.top = '25px';
        popover.style.right = '0px';
        popover.innerHTML = `
        <div class="tooltip-inner popover-inner" style="align-items: center; display: flex; gap: 0.5rem; position: relative; background: #f9f9f9; border-radius: 5px; box-shadow: 0 5px 30px rgba(0, 0, 0, .2); color: #000; padding: 16px;">
            <a href="/contribution/author/${item.textContent}/document" class="btn btn-secondary btn-sm">기여내역</a>
            <a href="${item.href}" class="btn btn-primary btn-sm">사용자 문서</a>
            <button class="btn btn-danger btn-sm" onclick="showAclGroupModal('${item.textContent}')">차단</button>
        </div>
        <div class="tooltip-arrow popover-arrow" style="border-style: solid; height: 0; margin: 5px; position: absolute; width: 0; z-index: 1; border-width: 0 5px 5px; right: 5px; margin-bottom: 0; margin-top: 0; top: -5px; border-left-color: transparent !important; border-right-color: transparent !important; border-top-color: transparent !important; border-color: #f9f9f9;"></div>`;
        item.setAttribute('onclick', "$(this).next().fadeToggle('fast'); return false;");
        item.parentElement.style.position = 'relative';
        item.after(popover);
    });
}

function showAclGroupModal(username) {
    // 모든 팝오버를 닫음
    document.querySelectorAll('.tooltip-inner.popover-inner').forEach(popover => {
        popover.style.display = 'none';
    });

    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = 'aclGroupModal';
    modal.tabIndex = '-1';
    modal.role = 'dialog';
    modal.setAttribute('aria-labelledby', 'aclGroupModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    fetch('/aclgroup/groups')
        .then(response => response.json())
        .then(data => {
            const groupOptions = data.groups.map(group => `<option>${group}</option>`).join('');
            const ipSelected = username.includes('.') && username.split('.').every(segment => !isNaN(segment));
            modal.innerHTML = `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="aclGroupModalLabel">빠른 ACLGroup</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="aclGroupForm">
                            <div class="form-group">
                                <label for="group">그룹</label>
                                <select class="form-control" id="group">
                                    ${groupOptions}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="target">대상</label>
                                <select class="form-control" id="mode">
                                    <option value="ip" ${ipSelected ? 'selected' : ''}>아이피</option>
                                    <option value="username" ${!ipSelected ? 'selected' : ''}>사용자 이름</option>
                                </select>
                                <input type="text" class="form-control" id="target" value="${username}">
                            </div>
                            <div class="form-group">
                                <label for="reason">사유</label>
                                <input type="text" class="form-control" id="reason" value="${block_log}">
                            </div>
                            <div class="form-group">
                                <label for="duration">차단 기간</label>
                                <select class="form-control" id="duration">
                                    <option value="0">영구</option>
                                    <option value="60">1분</option>
                                    <option value="300">5분</option>
                                    <option value="600">10분</option>
                                    <option value="1800">30분</option>
                                    <option value="3600">1시간</option>
                                    <option value="7200">2시간</option>
                                    <option value="86400">하루</option>
                                    <option value="259200">3일</option>
                                    <option value="432000">5일</option>
                                    <option value="604800">7일</option>
                                    <option value="1209600">2주</option>
                                    <option value="1814400">3주</option>
                                    <option value="2419200">4주</option>
                                    <option value="5184000">2개월</option>
                                    <option value="7776000">3개월</option>
                                    <option value="15552000">6개월</option>
                                    <option value="31536000">1년</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" id="addButton" data-dismiss="modal">추가</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">취소</button>
                    </div>
                </div>
            </div>`;
            document.body.appendChild(modal);
            $('#aclGroupModal').modal('show');

            document.getElementById('addButton').onclick = function() {
                const target = document.getElementById('target').value;
                const reason = document.getElementById('reason').value;
                const duration = document.getElementById('duration').value;
                const mode = document.getElementById('mode').value;
                // 실제 차단 요청을 서버로 전송
                fetch(`/aclgroup?group=${encodeURIComponent(group)}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mode: mode,
                        username: target,
                        note: reason,
                        expire: duration,
                    }),
                })
            }

            $('#aclGroupModal').on('hidden.bs.modal', function () {
                document.body.removeChild(modal);
            });
        })
        .catch(error => {
            console.error('그룹 목록을 불러오는 중 오류 발생:', error);
            alert('그룹 목록을 불러오는 데 실패했습니다.');
        });
}

