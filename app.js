(function () {
  'use strict';

  const STORAGE_KEY = 'chamcong_data';
  const SHIFT_LABELS = ['Ca sáng', 'Ca chiều', 'Ca tối'];

  let currentDate = new Date();
  let modalDay = null;
  let modalYear = null;
  let modalMonth = null;

  const el = {
    daysGrid: document.getElementById('daysGrid'),
    currentMonthLabel: document.getElementById('currentMonthLabel'),
    prevMonth: document.getElementById('prevMonth'),
    nextMonth: document.getElementById('nextMonth'),
    exportExcel: document.getElementById('exportExcel'),
    workingDaysCount: document.getElementById('workingDaysCount'),
    totalShiftsCount: document.getElementById('totalShiftsCount'),
    dayModal: document.getElementById('dayModal'),
    modalTitle: document.getElementById('modalTitle'),
    shiftOptions: document.getElementById('shiftOptions'),
    modalClose: document.getElementById('modalClose'),
  };

  function getStoredData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveStoredData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function monthKey(year, month) {
    return year + '-' + String(month + 1).padStart(2, '0');
  }

  function getMonthData(year, month) {
    const data = getStoredData();
    const key = monthKey(year, month);
    let monthData = data[key];
    if (Array.isArray(monthData)) {
      monthData = migrateOldFormat(monthData);
      data[key] = monthData;
      saveStoredData(data);
    }
    return monthData || {};
  }

  function migrateOldFormat(daysArray) {
    const obj = {};
    daysArray.forEach(function (d) {
      obj[String(d)] = [SHIFT_LABELS[0]];
    });
    return obj;
  }

  function getShiftsForDay(year, month, day) {
    const monthData = getMonthData(year, month);
    const d = String(day);
    return Array.isArray(monthData[d]) ? monthData[d].slice() : [];
  }

  function setShiftsForDay(year, month, day, shifts) {
    const data = getStoredData();
    const key = monthKey(year, month);
    const monthData = getMonthData(year, month);
    const d = String(day);
    if (shifts.length === 0) {
      delete monthData[d];
    } else {
      monthData[d] = shifts.slice();
    }
    data[key] = monthData;
    saveStoredData(data);
  }

  function toggleShiftForDay(year, month, day, shiftLabel) {
    const current = getShiftsForDay(year, month, day);
    const idx = current.indexOf(shiftLabel);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(shiftLabel);
    }
    setShiftsForDay(year, month, day, current);
  }

  function getDaysInMonth(year, month) {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const count = last.getDate();
    const startWeekday = first.getDay();
    return { count, startWeekday };
  }

  function openDayModal(year, month, day) {
    modalYear = year;
    modalMonth = month;
    modalDay = day;
    el.modalTitle.textContent = 'Chọn ca làm việc — Ngày ' + day;
    const selected = getShiftsForDay(year, month, day);
    el.shiftOptions.innerHTML = '';
    SHIFT_LABELS.forEach(function (label) {
      const isSelected = selected.indexOf(label) >= 0;
      const labelEl = document.createElement('label');
      labelEl.className = 'shift-option' + (isSelected ? ' selected' : '');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = isSelected;
      input.dataset.shift = label;
      input.addEventListener('change', function () {
        toggleShiftForDay(year, month, day, label);
        labelEl.classList.toggle('selected', input.checked);
        renderCalendar();
      });
      labelEl.appendChild(input);
      labelEl.appendChild(document.createTextNode(label));
      el.shiftOptions.appendChild(labelEl);
    });
    el.dayModal.hidden = false;
    el.dayModal.classList.remove('is-closing');
    el.dayModal.classList.add('is-open');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.dayModal.classList.add('is-visible');
      });
    });
  }

  function closeDayModal() {
    el.dayModal.classList.remove('is-visible');
    el.dayModal.classList.add('is-closing');
    setTimeout(function () {
      el.dayModal.hidden = true;
      el.dayModal.classList.remove('is-open', 'is-closing');
      modalDay = null;
    }, 280);
  }

  el.modalClose.addEventListener('click', closeDayModal);
  el.dayModal.addEventListener('click', function (e) {
    if (e.target === el.dayModal) closeDayModal();
  });

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const { count, startWeekday } = getDaysInMonth(year, month);

    el.currentMonthLabel.textContent =
      'Tháng ' + (month + 1) + ' / ' + year;

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevCount = new Date(prevYear, prevMonth + 1, 0).getDate();

    const cells = [];
    for (let i = startWeekday - 1; i >= 0; i--) {
      cells.push({ day: prevCount - i, otherMonth: true, empty: false });
    }
    for (let d = 1; d <= count; d++) {
      const shifts = getShiftsForDay(year, month, d);
      cells.push({
        day: d,
        otherMonth: false,
        empty: false,
        shifts: shifts,
        working: shifts.length > 0,
      });
    }
    const total = cells.length;
    const remainder = total % 7;
    const fill = remainder === 0 ? 0 : 7 - remainder;
    for (let i = 0; i < fill; i++) {
      cells.push({ day: i + 1, otherMonth: true, empty: false });
    }

    el.daysGrid.innerHTML = '';
    el.daysGrid.classList.remove('is-ready');
    requestAnimationFrame(function () {
      el.daysGrid.classList.add('is-ready');
    });
    cells.forEach(function (cell, index) {
      const div = document.createElement('div');
      div.className = 'day-cell';
      div.dataset.index = index;
      div.style.setProperty('--i', index);
      if (cell.empty) {
        div.classList.add('empty');
        div.textContent = '';
      } else {
        const inner = document.createElement('div');
        inner.style.display = 'flex';
        inner.style.flexDirection = 'column';
        inner.style.alignItems = 'center';
        inner.innerHTML = '<span>' + cell.day + '</span>';
        if (!cell.otherMonth && cell.working && cell.shifts && cell.shifts.length > 0) {
          const badges = document.createElement('span');
          badges.className = 'day-badges';
          badges.textContent = cell.shifts.length + ' ca';
          inner.appendChild(badges);
        }
        div.appendChild(inner);
        if (cell.otherMonth) {
          div.classList.add('other-month');
        } else {
          if (cell.working) div.classList.add('working');
          div.dataset.day = cell.day;
        }
      }
      el.daysGrid.appendChild(div);
    });

    var workingCount = 0;
    var totalShifts = 0;
    cells.forEach(function (c) {
      if (!c.otherMonth && c.shifts && c.shifts.length > 0) {
        workingCount++;
        totalShifts += c.shifts.length;
      }
    });
    el.workingDaysCount.innerHTML =
      'Số ngày có làm: <strong>' + workingCount + '</strong>';
    el.totalShiftsCount.innerHTML =
      'Tổng số ca: <strong>' + totalShifts + '</strong>';

    el.daysGrid.querySelectorAll('.day-cell[data-day]').forEach(function (node) {
      node.addEventListener('click', function () {
        const day = parseInt(node.dataset.day, 10);
        openDayModal(year, month, day);
      });
    });
  }

  function goPrevMonth() {
    var grid = el.daysGrid;
    grid.classList.add('month-prev');
    setTimeout(function () {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
      grid.classList.remove('month-prev');
    }, 180);
  }

  function goNextMonth() {
    var grid = el.daysGrid;
    grid.classList.add('month-next');
    setTimeout(function () {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
      grid.classList.remove('month-next');
    }, 180);
  }

  function exportToExcel() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthData = getMonthData(year, month);
    const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const lastDay = new Date(year, month + 1, 0).getDate();

    const headerRow = ['STT', 'Ngày', 'Thứ'].concat(SHIFT_LABELS);
    const rows = [
      ['BẢNG CHẤM CÔNG - THÁNG ' + (month + 1) + '/' + year],
      [],
      headerRow,
    ];

    var workingDaysCount = 0;
    var totalCa = 0;
    for (var d = 1, stt = 1; d <= lastDay; d++, stt++) {
      var date = new Date(year, month, d);
      var thu = dayNames[date.getDay()];
      var shifts = getShiftsForDay(year, month, d);
      var row = [stt, d, thu];
      SHIFT_LABELS.forEach(function (label) {
        var has = shifts.indexOf(label) >= 0 ? 'X' : '';
        row.push(has);
      });
      rows.push(row);
      if (shifts.length > 0) {
        workingDaysCount++;
        totalCa += shifts.length;
      }
    }

    rows.push([]);
    rows.push(['Số ngày có làm:', workingDaysCount]);
    rows.push(['Tổng số ca:', totalCa]);

    if (typeof XLSX === 'undefined') {
      alert('Không tải được thư viện xuất Excel. Kiểm tra kết nối mạng.');
      return;
    }

    var ws = XLSX.utils.aoa_to_sheet(rows);
    var colWidths = [{ wch: 6 }, { wch: 8 }, { wch: 14 }];
    SHIFT_LABELS.forEach(function () { colWidths.push({ wch: 12 }); });
    ws['!cols'] = colWidths;

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ChamCong');

    var fileName = 'ChamCong_Thang' + (month + 1) + '_' + year + '.xlsx';
    XLSX.writeFile(wb, fileName);
  }

  el.prevMonth.addEventListener('click', goPrevMonth);
  el.nextMonth.addEventListener('click', goNextMonth);
  el.exportExcel.addEventListener('click', exportToExcel);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }

  renderCalendar();
})();
