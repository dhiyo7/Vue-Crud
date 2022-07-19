<template>
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Diari Jajan Februari</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Pengeluaran Bulan Ini Rp. {{total}}</p>
      <button
          class="flex mx-auto mt-6 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
        Tambah Item
      </button>
      <div class="flex flex-wrap -m-4 mt-10 ">
        <div v-for="detail of newDetails" class="xl:w-1/4 md:w-1/2 p-4">
          <div class="bg-gray-100 p-6 rounded-lg">
            <p class="mb-4 text-left text-bold">{{ detail.tanggal }}</p>
            <div v-for="datum of detail.data" class="flex border-t border-gray-200 py-2">
              <span class="text-gray-500">{{ datum.jam }}</span>
              <span class="ml-2 mr-2 text-gray-500">{{ datum.nama }}</span>
              <span class="ml-auto text-gray-900">Rp.{{ datum.pengeluaraan }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Test",
  data() {
    return {
      details: [],
      newDetails: [],
      total: null
    }
  },
  async created() {
    try {
      const res = await axios.get(`http://localhost:3000/detail`);
      this.details = res.data;
      let group_to_values = this.details.reduce(function (obj, item) {
        obj[item.tanggal] = obj[item] || [];
        obj[item.tanggal].push(item);
        return obj;
      }, {});
      let groups = Object.keys(group_to_values).map(function (key) {
        return {tanggal: key, data: group_to_values[key]};
      });
      this.newDetails = groups
      let sum = this.newDetails.map((data) => {
        return data.data[0]
      })
      const total = sum.reduce((acc, obj) => {
        return acc + obj.pengeluaraan
      }, 0)
      this.total = total
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<style scoped>

</style>
