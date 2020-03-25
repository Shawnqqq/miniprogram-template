Component({
  properties: {
    test_prop: {
      type: String,
      value: "",
      observer: function(newVal, oldVal) {}
    }
  },
  data: {
    title: ""
  },
  timeEvent: null,
  methods: {
    show: function(type = "success", title, duration = 2000) {
      clearTimeout(this.times);
      this.setData({ type, title });
      this.times = setTimeout(() => this._hide(), duration);
    },
    _hide: function() {
      let title = "";
      this.setData({ title });
    }
  }
});
