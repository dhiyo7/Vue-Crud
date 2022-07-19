<template>
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Diari Jajan Dhiyo</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Pengeluaran Bulan Ini {{total}}</p>
      <button
          @click="onToggle"
          class="flex mx-auto mt-6 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
        Tambah Item
      </button>
      <transition name="fade">
        <div v-if="!isModalVisible">
          <div
              @click="onToggle"
              class="absolute bg-black opacity-70 inset-0 z-0"
          ></div>
          <div
              class="w-full max-w-lg p-3 relative mx-auto my-auto rounded-xl shadow-lg bg-white"
          >
            <div>
              <div class="text-left p-3 flex-auto justify-center leading-6">
                <h2 class="text-2xl font-bold py-4">Tambah Entri</h2>
                <div class="mb-3 pt-0">
                  <span class="text-left">Nama</span>
                  <input type="text" placeholder="Placeholder" class="px-2 py-1 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
                </div>
                <div class="mb-3 pt-0 mt-2">
                  <span class="text-left">Harga</span>
                  <input type="number" placeholder="Placeholder" class="px-2 py-1 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
                </div>
              </div>
              <div class="p-3 mt-2 text-center space-x-4 md:block">
                <button
                    @click="onToggle"
                    class="mb-2 md:mb-0 bg-indigo-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                >
                  Close
                </button>
                <button
                    @click="onToggle"
                    class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-md hover:shadow-lg hover:bg-gray-100"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="flex flex-wrap -m-4 mt-10 ">
        <div v-for="detail of newDetails" class="xl:w-1/4 md:w-1/2 p-4">
          <div class="bg-gray-100 p-6 rounded-lg">
            <p class="mb-4 text-left text-bold">{{ detail.tanggal }}</p>
            <div v-for="datum of detail.data" class="flex border-t border-gray-200 py-2">
              <span class="text-gray-500">{{ datum.jam }}</span>
              <span class="ml-2 mr-2 text-gray-500">{{ datum.nama }}</span>
              <span class="ml-auto text-gray-900">{{formatRupiah(datum.pengeluaraan) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {formatRupiah} from "../Utils/index.js";

export default {
  name: "Test",
  data() {
    return {
      details: [],
      newDetails: [],
      total: null,
      items: null,
      isOpen: false
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
      this.total = formatRupiah(total)
    } catch (error) {
      console.log(error);
    }
  },

  computed: {
    isModalVisible() {
      return !this.isOpen;
    }
  },

  methods: {
    formatRupiah: formatRupiah,
    onToggle() {
      this.isOpen = !this.isOpen;
    }
  }
}
</script>

<style scoped>

</style>
