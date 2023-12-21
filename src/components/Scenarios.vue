<script>

export default {
  name: "ScenarioList",
  el: '#app',
  data() {
    return{
      items:[
        { id: 1, label: "#1", highlighted: false },
        { id: 2, label: "#2", highlighted: false  },
        { id: 3, label: "#3", highlighted: false  },
        { id: 4, label: "#4", highlighted: false  },
        { id: 5, label: "#5", highlighted: false  },
        { id: 6, label: "#6", highlighted: false  },
        { id: 7, label: "#7", highlighted: false  },
        { id: 8, label: "#8", highlighted: false  },
      ],
  };
},
  methods:{
    newScenario() {
      // push a new item to the list
      this.items.push({ id: this.items.length +1, label: "#"+ (this.items.length +1), highlighted: true});
      this.$nextTick(() => {this.scrollToItem()});
      // reset the highlighted coloar after 1 second
      setTimeout(() => {
          this.items.forEach(element => {
            element.highlighted = false;
          });
          }, 1000);
    },
    // Scroll automaticly to the newly added item
    scrollToItem(){ 
      const listContent = this.$refs.listContent;
      if (listContent){
        listContent.scrollTop = listContent.scrollHeight;
      }
    },
}  
};

</script>


<template>
  <h1>Scenarios</h1>
  <div class="btn-group">
    <button class="search-button" @click="test">Search</button>
    <button class="new-button" @click="newScenario">New</button>
  </div>
  <div class="list-container">
    <div class="list-content" ref="listContent">
      <div v-for="item in items" :key="item.id" :class="{'list-item': true, 'highlighted': item.highlighted}">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>


<style scoped>
.search-button {
  background-color: rgb(146, 208, 223);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.search-button:hover {
  background-color: rgb(87, 144, 158);
}
.new-button {
  background-color: rgb(114, 214, 101);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.new-button:hover {
  background-color: rgb(73, 167, 61);
}

body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }

    .list-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
      height: 370px; /* Set a fixed height for the container */
    }

    .list-item {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      transition: background-color 0.3s;
    }

    .list-item:hover {
      background-color: #f0f0f0;
    }

    .list-content {
      max-height: 100%; /* Ensure that the content can take full height */
      overflow-y: scroll; /* Enable vertical scrollbar */
    }

    .highlighted {
      background-color: #d8ffcf;
    }
</style>